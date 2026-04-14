import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { languageService } from '@/features/language/lib/language.service';
import { createTranslator } from '@/features/language/lib/language.utils';
import { languageConfig } from '@/features/language/language.config';
import { initializeFarmGrid } from '@/features/farm/farm.service';
import { FARM_CONFIG } from '@/features/farm/farm.config';
import {
  initializeSustainabilityState,
  calculateDayScore,
  calculateTotalScore,
  trackDailyActivities
} from '@/features/sustainability';
import { getAllQuests } from '@/features/quests/quests.config';
import {
  updateAllQuestProgress,
  getNewlyCompletedQuests,
  applyQuestReward
} from '@/features/quests/quests.service';
import { initializeGoals, updateGoalProgress } from '@/features/goals/goals.service';

export const useStore = create(
  persist(
    (set, get) => ({
      // UI slice
      ui: {
        theme: 'light',
        modal: null,
        selectedTool: 'none', // none | hoe | watering_can | seed_bag | harvest_tool
        selectedSeed: 'wheat',
        modalOpen: null, // null | 'education' | 'codex' | 'quest' | 'shop'
        modalData: null,
        feedback: null, // { success: boolean, message: string, timestamp: number }
        npcDialogueOpen: false, // NPC dialogue trigger
        setTheme: (theme) => {
          set((s) => ({ ui: { ...s.ui, theme } }));
          document.documentElement.classList.toggle('dark', theme === 'dark');
        },
        openModal: (id) => set((s) => ({ ui: { ...s.ui, modal: id } })),
        closeModal: () => set((s) => ({ ui: { ...s.ui, modal: null } })),
        setTool: (tool) => set((s) => ({ ui: { ...s.ui, selectedTool: tool } })),
        setSelectedSeed: (seed) => set((s) => ({ ui: { ...s.ui, selectedSeed: seed } })),
        openGameModal: (type, data) => set((s) => ({ ui: { ...s.ui, modalOpen: type, modalData: data } })),
        closeGameModal: () => set((s) => ({ ui: { ...s.ui, modalOpen: null, modalData: null } })),
        setFeedback: (feedback) => set((s) => ({ ui: { ...s.ui, feedback } })),
        clearFeedback: () => set((s) => ({ ui: { ...s.ui, feedback: null } })),
        setNPCDialogueOpen: (open) => set((s) => ({ ui: { ...s.ui, npcDialogueOpen: open } })),
      },

      // Data slice
      data: {
        items: [],
        loading: false,
        error: null,
        setItems: (items) => set((s) => ({ data: { ...s.data, items } })),
        setLoading: (loading) => set((s) => ({ data: { ...s.data, loading } })),
        setError: (error) => set((s) => ({ data: { ...s.data, error } })),
      },

      // Language slice
      language: {
        currentLang: languageConfig.defaultLanguage,
        availableLanguages: languageService.getAvailableLanguages(),
        setLanguage: (lang) => set((s) => ({ language: { ...s.language, currentLang: lang } })),
        t: (path) => {
          const lang = get().language.currentLang;
          const translations = languageService.getTranslations();
          const translator = createTranslator(translations, lang, languageConfig.fallbackLanguage);
          return translator(path);
        },
      },

      // Background slice
      background: {
        backgroundImage: null,
        setBackgroundImage: (url) => set((s) => ({ background: { ...s.background, backgroundImage: url } })),
        resetBackgroundImage: () => set((s) => ({ background: { ...s.background, backgroundImage: null } })),
      },

      // ===== HERITAGE HARVEST GAME STATE SLICES =====

      // Game state slice
      game: {
        isPlaying: false,
        isPaused: false,
        currentDay: 1,
        timeOfDay: 0, // 0-1 (0=morning, 0.5=noon, 1=night)
        attractMode: false, // Whether attract mode is active

        startGame: () => set((s) => ({
          game: { ...s.game, isPlaying: true, isPaused: false, attractMode: false }
        })),
        pauseGame: () => set((s) => ({
          game: { ...s.game, isPaused: true }
        })),
        resumeGame: () => set((s) => ({
          game: { ...s.game, isPaused: false }
        })),
        advanceDay: () => set((s) => ({
          game: { ...s.game, currentDay: s.game.currentDay + 1 }
        })),
        setTimeOfDay: (time) => set((s) => ({
          game: { ...s.game, timeOfDay: time }
        })),
        setAttractMode: (active) => set((s) => ({
          game: { ...s.game, attractMode: active }
        })),
      },

      // Farm state slice
      farm: {
        tiles: initializeFarmGrid(), // Initialize 64 tiles with proper structure

        updateTile: (id, updates) => set((s) => ({
          farm: {
            ...s.farm,
            tiles: s.farm.tiles.map(t =>
              t.id === id ? { ...t, ...updates } : t
            )
          }
        })),

        plantCrop: (tileId, cropType) => {
          // Track crop planting for sustainability
          get().sustainabilityActions.trackCropPlanted(cropType);

          set((s) => ({
            farm: {
              ...s.farm,
              tiles: s.farm.tiles.map(t =>
                t.id === tileId
                  ? {
                    ...t,
                    state: FARM_CONFIG.TILE_STATES.PLANTED,
                    crop: cropType,
                    growthStage: 0,
                    daysPlanted: 0,
                  }
                  : t
              )
            },
            session: {
              ...s.session,
              analytics: {
                ...s.session.analytics,
                cropsPlanted: (s.session.analytics.cropsPlanted || 0) + 1
              }
            }
          }));
        },

        harvestCrop: (tileId) => {
          const tile = get().farm.tiles.find(t => t.id === tileId);
          if (tile?.crop && tile.state === FARM_CONFIG.TILE_STATES.READY) {
            // Add crop to inventory (coins earned when selling at shop)
            get().inventory.addItem(tile.crop, 1);

            set((s) => ({
              farm: {
                ...s.farm,
                tiles: s.farm.tiles.map(t =>
                  t.id === tileId
                    ? {
                      ...t,
                      state: FARM_CONFIG.TILE_STATES.TILLED,
                      crop: null,
                      growthStage: 0,
                      daysPlanted: 0,
                    }
                    : t
                )
              },
              session: {
                ...s.session,
                analytics: {
                  ...s.session.analytics,
                  cropsHarvested: (s.session.analytics.cropsHarvested || 0) + 1
                }
              }
            }));
          }
        },

        tillTile: (tileId) => set((s) => ({
          farm: {
            ...s.farm,
            tiles: s.farm.tiles.map(t =>
              t.id === tileId && t.state === FARM_CONFIG.TILE_STATES.UNTILLED
                ? { ...t, state: FARM_CONFIG.TILE_STATES.TILLED }
                : t
            )
          }
        })),

        waterTile: (tileId) => {
          const state = get();
          const tile = state.farm.tiles.find(t => t.id === tileId);

          if (!tile) return;

          // Get watering can upgrade level
          const wateringCanLevel = state.inventory.upgrades.wateringCan;
          const areaSize = wateringCanLevel === 'steel' ? 5 : wateringCanLevel === 'copper' ? 3 : 1;

          // Get tiles to water based on area size
          const { getAdjacentTiles } = require('@/features/farm/farm.service');
          const tilesToWater = getAdjacentTiles(state.farm.tiles, tile.row, tile.col, areaSize);

          // Track over-watering for each tile
          tilesToWater.forEach(targetTileId => {
            const targetTile = state.farm.tiles.find(t => t.id === targetTileId);
            if (targetTile && (targetTile.isWatered || targetTile.state === FARM_CONFIG.TILE_STATES.READY)) {
              state.sustainabilityActions.trackOverWatering();
            }
          });

          // Water all tiles in the area
          set((s) => ({
            farm: {
              ...s.farm,
              tiles: s.farm.tiles.map(t =>
                tilesToWater.includes(t.id)
                  ? {
                    ...t,
                    // Preserve READY state - don't change it back to WATERED
                    state: t.state === FARM_CONFIG.TILE_STATES.READY
                      ? FARM_CONFIG.TILE_STATES.READY
                      : FARM_CONFIG.TILE_STATES.WATERED,
                    isWatered: true,
                    wateredDaysRemaining: FARM_CONFIG.WATER_DURATION_DAYS,
                  }
                  : t
              )
            }
          }));
        },
      },

      // Inventory state slice
      inventory: {
        coins: FARM_CONFIG.INITIAL_COINS,
        seeds: { ...FARM_CONFIG.INITIAL_SEEDS },
        harvested: {
          bean: 0,
          wheat: 0,
          tomato: 0,
          carrot: 0,
          egg: 0, // Add eggs to harvested items
        },
        upgrades: {
          wateringCan: 'basic', // 'basic' | 'copper' | 'steel'
          inventorySize: 12,    // 12 | 24 | 48
        },

        // Helper: Calculate seeds inventory count (only seeds, not harvested items)
        getSeedsInventoryCount: () => {
          const state = get();
          const seedsCount = Object.values(state.inventory.seeds).reduce((sum, count) => sum + count, 0);
          return seedsCount;
        },

        // Helper: Calculate harvested items count (for display only, no limit)
        getHarvestedInventoryCount: () => {
          const state = get();
          const harvestedCount = Object.values(state.inventory.harvested).reduce((sum, count) => sum + count, 0);
          return harvestedCount;
        },

        addCoins: (amount) => {
          // Play coin earning sound
          import('@/features/audio/audio.service').then(({ playSfx }) => {
            playSfx('coinEarn');
          });

          set((s) => ({
            inventory: { ...s.inventory, coins: s.inventory.coins + amount }
          }));
        },

        spendCoins: (amount) => set((s) => ({
          inventory: { ...s.inventory, coins: Math.max(0, s.inventory.coins - amount) }
        })),

        addItem: (type, quantity) => {
          // Harvested items have unlimited storage - no capacity check
          set((s) => ({
            inventory: {
              ...s.inventory,
              harvested: {
                ...s.inventory.harvested,
                [type]: (s.inventory.harvested[type] || 0) + quantity
              }
            }
          }));

          return { success: true };
        },

        purchaseUpgrade: (upgradeType, upgradeTier, cost) => {
          const state = get();

          // Validate coin balance
          if (state.inventory.coins < cost) {
            return { success: false, message: 'Not enough coins!' };
          }

          // Deduct coins
          state.inventory.spendCoins(cost);

          // Update upgrade
          set((s) => ({
            inventory: {
              ...s.inventory,
              upgrades: {
                ...s.inventory.upgrades,
                [upgradeType]: upgradeTier
              }
            }
          }));

          return { success: true, message: 'Upgrade purchased!' };
        },

        useSeed: (type) => set((s) => ({
          inventory: {
            ...s.inventory,
            seeds: {
              ...s.inventory.seeds,
              [type]: Math.max(0, (s.inventory.seeds[type] || 0) - 1)
            }
          }
        })),

        addSeeds: (type, quantity) => {
          const state = get();
          const currentCount = state.inventory.getSeedsInventoryCount();
          const maxCapacity = state.inventory.upgrades.inventorySize;

          // Check if adding seeds would exceed capacity (only seeds count)
          if (currentCount + quantity > maxCapacity) {
            return { success: false, message: 'Seed Inventory Full!' };
          }

          set((s) => ({
            inventory: {
              ...s.inventory,
              seeds: {
                ...s.inventory.seeds,
                [type]: (s.inventory.seeds[type] || 0) + quantity
              }
            }
          }));

          return { success: true };
        },
      },

      // Session state slice
      session: {
        startTime: null,
        lastInteraction: Date.now(),
        analytics: {
          cropsPlanted: 0,
          cropsHarvested: 0,
          cropTypesPlanted: [], // Track unique crop types planted
          eggsCollected: 0, // Track eggs collected
          modalsOpened: 0,
          viewedModals: [], // Track which crop modals have been viewed
          codexEntriesUnlocked: [],
          finalSustainabilityScore: 0
        },
        goals: initializeGoals(), // Initialize goals tracking

        startSession: () => set((s) => ({
          session: { ...s.session, startTime: Date.now(), lastInteraction: Date.now() }
        })),

        updateInteraction: () => set((s) => ({
          session: { ...s.session, lastInteraction: Date.now() }
        })),

        trackEvent: (event, data) => set((s) => ({
          session: {
            ...s.session,
            analytics: {
              ...s.session.analytics,
              ...data
            }
          }
        })),

        trackModalView: (cropId) => set((s) => {
          const viewedModals = s.session.analytics.viewedModals || [];
          if (!viewedModals.includes(cropId)) {
            return {
              session: {
                ...s.session,
                analytics: {
                  ...s.session.analytics,
                  viewedModals: [...viewedModals, cropId],
                  modalsOpened: s.session.analytics.modalsOpened + 1
                }
              }
            };
          }
          return {
            session: {
              ...s.session,
              analytics: {
                ...s.session.analytics,
                modalsOpened: s.session.analytics.modalsOpened + 1
              }
            }
          };
        }),

        // Goal tracking methods
        updateGoals: () => set((s) => {
          const { updatedGoals, newlyCompleted } = updateGoalProgress(s.session.goals, s);

          // Show notifications for newly completed goals
          if (newlyCompleted.length > 0) {
            newlyCompleted.forEach(goal => {
              s.ui.setFeedback({
                success: true,
                message: `🎉 Goal Complete: ${goal.title}! Earned: ${goal.reward}`,
                timestamp: Date.now(),
              });
            });
          }

          return {
            session: {
              ...s.session,
              goals: updatedGoals,
            }
          };
        }),

        trackCropPlanted: (cropType) => set((s) => {
          const cropTypesPlanted = s.session.analytics.cropTypesPlanted || [];
          const updatedTypes = cropTypesPlanted.includes(cropType)
            ? cropTypesPlanted
            : [...cropTypesPlanted, cropType];

          const newState = {
            session: {
              ...s.session,
              analytics: {
                ...s.session.analytics,
                cropTypesPlanted: updatedTypes,
              }
            }
          };

          // Update goals after tracking
          setTimeout(() => get().session.updateGoals(), 0);

          return newState;
        }),

        trackEggCollected: () => set((s) => {
          const newState = {
            session: {
              ...s.session,
              analytics: {
                ...s.session.analytics,
                eggsCollected: (s.session.analytics.eggsCollected || 0) + 1,
              }
            }
          };

          // Update goals after tracking
          setTimeout(() => get().session.updateGoals(), 0);

          return newState;
        }),

        resetSession: () => set((s) => ({
          game: {
            isPlaying: false,
            isPaused: false,
            currentDay: 1,
            timeOfDay: 0,
            attractMode: false, // Explicitly reset attract mode
            startGame: s.game.startGame,
            pauseGame: s.game.pauseGame,
            resumeGame: s.game.resumeGame,
            advanceDay: s.game.advanceDay,
            setTimeOfDay: s.game.setTimeOfDay,
            setAttractMode: s.game.setAttractMode,
          },
          farm: {
            ...s.farm,
            tiles: initializeFarmGrid() // Reset to initial grid state
          },
          inventory: {
            ...s.inventory,
            coins: FARM_CONFIG.INITIAL_COINS,
            seeds: { ...FARM_CONFIG.INITIAL_SEEDS },
            harvested: { bean: 0, wheat: 0, tomato: 0, carrot: 0, egg: 0 },
            upgrades: {
              wateringCan: 'basic',
              inventorySize: 12,
            }
          },
          animals: {
            ...s.animals,
            chickens: []
          },
          session: {
            ...s.session,
            startTime: null,
            lastInteraction: Date.now(),
            analytics: {
              cropsPlanted: 0,
              cropsHarvested: 0,
              cropTypesPlanted: [],
              eggsCollected: 0,
              modalsOpened: 0,
              viewedModals: [],
              codexEntriesUnlocked: [],
              finalSustainabilityScore: 0
            },
            goals: initializeGoals(), // Reset goals
          },
          sustainability: initializeSustainabilityState(),
          quests: {
            ...s.quests,
            activeQuests: [],
            completedQuestIds: [],
            currentQuestId: null,
          }
        })),
      },

      // Sustainability state slice
      sustainability: initializeSustainabilityState(),

      // Animals state slice
      animals: {
        chickens: [], // Array of chicken objects

        initializeChickens: (chickens) => set((s) => ({
          animals: { ...s.animals, chickens }
        })),

        feedChicken: (chickenId) => set((s) => ({
          animals: {
            ...s.animals,
            chickens: s.animals.chickens.map(c =>
              c.id === chickenId ? { ...c, fed: true, lastFedDay: s.game.currentDay } : c
            )
          }
        })),

        advanceChickensDay: () => {
          const state = get();
          const currentDay = state.game.currentDay;
          let eggsProduced = 0;

          const updatedChickens = state.animals.chickens.map(chicken => {
            const producesEgg = chicken.fed && chicken.lastFedDay === currentDay - 1;
            if (producesEgg) {
              eggsProduced++;
            }
            return {
              ...chicken,
              fed: false,
              currentDay,
              producedEgg: producesEgg,
            };
          });

          // Add eggs to inventory
          if (eggsProduced > 0) {
            state.inventory.addItem('egg', eggsProduced);

            // Track eggs collected for goals
            for (let i = 0; i < eggsProduced; i++) {
              state.session.trackEggCollected();
            }
          }

          set((s) => ({
            animals: { ...s.animals, chickens: updatedChickens }
          }));
        },

        resetChickens: () => set((s) => ({
          animals: { ...s.animals, chickens: [] }
        })),
      },

      // Quest state slice
      quests: {
        activeQuests: [], // Array of quest objects with progress
        completedQuestIds: [], // Array of completed quest IDs
        currentQuestId: null, // ID of the quest being displayed/tracked

        // Initialize quests from config
        initializeQuests: () => {
          const allQuests = getAllQuests();

          // Create quest objects with initial progress
          const activeQuests = allQuests.map(questConfig => ({
            ...questConfig,
            current: 0,
            completed: false,
          }));

          // Reset analytics when quests initialize (fresh start)
          set((s) => ({
            quests: {
              ...s.quests,
              activeQuests,
              currentQuestId: activeQuests[0]?.id || null,
            },
            session: {
              ...s.session,
              analytics: {
                ...s.session.analytics,
                cropsPlanted: 0,
                cropsHarvested: 0,
              }
            }
          }));
        },

        // Update progress for all active quests
        updateQuestProgress: () => {
          const state = get();

          const previousQuests = state.quests.activeQuests;
          const updatedQuests = updateAllQuestProgress(previousQuests, state);
          const newlyCompleted = getNewlyCompletedQuests(previousQuests, updatedQuests);

          // Apply rewards for newly completed quests
          if (newlyCompleted.length > 0) {
            newlyCompleted.forEach(quest => {
              applyQuestReward(quest.reward, { getState: get });
            });
          }

          // Update completed quest IDs
          const completedIds = updatedQuests
            .filter(q => q.completed)
            .map(q => q.id);

          set((s) => ({
            quests: {
              ...s.quests,
              activeQuests: updatedQuests,
              completedQuestIds: completedIds,
            }
          }));

          return newlyCompleted;
        },

        // Set the current quest being viewed/tracked
        setCurrentQuest: (questId) => set((s) => ({
          quests: { ...s.quests, currentQuestId: questId }
        })),

        // Get the next incomplete quest
        getNextIncompleteQuest: () => {
          const state = get();
          return state.quests.activeQuests.find(q => !q.completed);
        },

        // Complete a specific quest (for testing/debugging)
        completeQuest: (questId) => {
          const state = get();
          const quest = state.quests.activeQuests.find(q => q.id === questId);

          if (quest && !quest.completed) {
            applyQuestReward(quest.reward, { getState: get });

            set((s) => ({
              quests: {
                ...s.quests,
                activeQuests: s.quests.activeQuests.map(q =>
                  q.id === questId ? { ...q, completed: true, current: q.target } : q
                ),
                completedQuestIds: [...s.quests.completedQuestIds, questId],
              }
            }));
          }
        },
      },

      sustainabilityActions: {
        // Track a crop being planted
        trackCropPlanted: (cropType) => set((s) => ({
          sustainability: {
            ...s.sustainability,
            currentDayData: {
              ...s.sustainability.currentDayData,
              cropsPlanted: [...s.sustainability.currentDayData.cropsPlanted, cropType]
            }
          }
        })),

        // Track over-watering
        trackOverWatering: () => set((s) => ({
          sustainability: {
            ...s.sustainability,
            currentDayData: {
              ...s.sustainability.currentDayData,
              overWateredTiles: s.sustainability.currentDayData.overWateredTiles + 1,
              efficientWatering: false
            }
          }
        })),

        // Calculate and store day score at end of day
        calculateDayScore: () => {
          const state = get();
          const dayData = state.sustainability.currentDayData;

          // Calculate score for the day
          const dayScore = calculateDayScore(dayData);

          // Add to daily scores
          const dailyScores = [...state.sustainability.dailyScores, dayScore];

          // Calculate total score
          const totalScore = calculateTotalScore(dailyScores);

          // Check for achievement unlock
          const achievementUnlocked = totalScore >= 80;

          set((s) => ({
            sustainability: {
              ...s.sustainability,
              currentScore: totalScore,
              dailyScores,
              achievementUnlocked,
              currentDayData: {
                cropsPlanted: [],
                witheredCrops: 0,
                overWateredTiles: 0,
                efficientWatering: true
              }
            },
            session: {
              ...s.session,
              analytics: {
                ...s.session.analytics,
                finalSustainabilityScore: totalScore
              }
            }
          }));

          return { totalScore, dayScore, achievementUnlocked };
        },

        // Track daily activities automatically
        trackDailyActivities: (previousDayTiles) => {
          const state = get();
          const currentTiles = state.farm.tiles;

          const activities = trackDailyActivities(currentTiles, previousDayTiles);

          set((s) => ({
            sustainability: {
              ...s.sustainability,
              currentDayData: {
                ...s.sustainability.currentDayData,
                ...activities
              }
            }
          }));
        },

        // Reset sustainability tracking
        resetSustainability: () => set((s) => ({
          sustainability: initializeSustainabilityState()
        })),
      },
    }),
    {
      name: 'heritage-harvest-storage',
      partialize: (state) => ({
        language: { currentLang: state.language.currentLang },
        // Only persist analytics across sessions
        session: {
          analytics: state.session?.analytics
        },
        // DO NOT persist quest progress - quests reset on page refresh
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        language: {
          ...currentState.language,
          ...(persistedState.language || {}),
        },
        session: {
          ...currentState.session,
          analytics: {
            ...currentState.session.analytics,
            ...(persistedState?.session?.analytics || {})
          }
        },
        // Quests always start fresh - no persistence
      }),
    }
  )
);
