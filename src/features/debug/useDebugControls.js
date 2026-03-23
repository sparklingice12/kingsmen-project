import { button, folder, useControls } from 'leva';
import { DEBUG_DEFAULTS } from './debug.config';

export function useDebugControls({
  detailItems,
  onJumpToGallery,
  onJumpToDetail,
  onJumpToAttractor,
  onShowInactivity,
  onHideInactivity,
}) {
  const detailItemOptions = detailItems.reduce((options, item) => {
    const label = item.title?.en || item.id;
    options[label] = item.id;
    return options;
  }, {});

  const controls = useControls(
    () => ({
      Flow: folder(
        {
          detailItemId: {
            value: DEBUG_DEFAULTS.flow.detailItemId,
            options: detailItemOptions,
          },
          jumpToGallery: button(() => onJumpToGallery()),
          jumpToDetail: button((get) => onJumpToDetail(get('detailItemId'))),
          jumpToAttractor: button(() => onJumpToAttractor()),
          showInactivity: button((get) => onShowInactivity(get('detailItemId'))),
          hideInactivity: button(() => onHideInactivity()),
        },
        { collapsed: false }
      ),
      'Layout Animation': folder(
        {
          backgroundTransitionDuration: {
            value: DEBUG_DEFAULTS.layout.backgroundTransitionDuration,
            min: 0,
            max: 5,
            step: 0.05,
          },
        },
        { collapsed: true }
      ),
      'Gallery Behavior': folder(
        {
          scrollAmount: {
            value: DEBUG_DEFAULTS.gallery.scrollAmount,
            min: 50,
            max: 1200,
            step: 10,
          },
        },
        { collapsed: true }
      ),
      'Gallery Animation': folder(
        {
          delayChildren: {
            value: DEBUG_DEFAULTS.gallery.animation.delayChildren,
            min: 0,
            max: 1,
            step: 0.01,
          },
          staggerChildren: {
            value: DEBUG_DEFAULTS.gallery.animation.staggerChildren,
            min: 0,
            max: 0.3,
            step: 0.005,
          },
          itemFadeDuration: {
            value: DEBUG_DEFAULTS.gallery.animation.itemFadeDuration,
            min: 0,
            max: 2,
            step: 0.01,
          },
          exitDuration: {
            value: DEBUG_DEFAULTS.gallery.animation.exitDuration,
            min: 0,
            max: 2,
            step: 0.01,
          },
          exitYOffset: {
            value: DEBUG_DEFAULTS.gallery.animation.exitYOffset,
            min: -200,
            max: 200,
            step: 1,
          },
        },
        { collapsed: true }
      ),
      'Gallery Fade': folder(
        {
          enabled: { value: DEBUG_DEFAULTS.gallery.mask.enabled },
          fadeStrength: {
            value: DEBUG_DEFAULTS.gallery.mask.fadeStrength,
            min: 0,
            max: 1,
            step: 0.01,
          },
          leftFadeWidth: {
            value: DEBUG_DEFAULTS.gallery.mask.leftFadeWidth,
            min: 0,
            max: 40,
            step: 0.5,
          },
          rightFadeWidth: {
            value: DEBUG_DEFAULTS.gallery.mask.rightFadeWidth,
            min: 0,
            max: 40,
            step: 0.5,
          },
        },
        { collapsed: true }
      ),
      'Detail Animation': folder(
        {
          damping: {
            value: DEBUG_DEFAULTS.detail.animation.damping,
            min: 1,
            max: 80,
            step: 1,
          },
          stiffness: {
            value: DEBUG_DEFAULTS.detail.animation.stiffness,
            min: 50,
            max: 600,
            step: 5,
          },
        },
        { collapsed: true }
      ),
      'Language Animation': folder(
        {
          screenDuration: {
            value: DEBUG_DEFAULTS.language.screenDuration,
            min: 0,
            max: 3,
            step: 0.01,
          },
          exitScale: {
            value: DEBUG_DEFAULTS.language.exitScale,
            min: 0.8,
            max: 1.5,
            step: 0.01,
          },
          exitBlur: {
            value: DEBUG_DEFAULTS.language.exitBlur,
            min: 0,
            max: 30,
            step: 0.5,
          },
          logoInitialScale: {
            value: DEBUG_DEFAULTS.language.logoInitialScale,
            min: 0.2,
            max: 1.5,
            step: 0.01,
          },
          logoDuration: {
            value: DEBUG_DEFAULTS.language.logoDuration,
            min: 0,
            max: 3,
            step: 0.01,
          },
        },
        { collapsed: true }
      ),
      Inactivity: folder(
        {
          timeout: {
            value: DEBUG_DEFAULTS.inactivity.timeout,
            min: 1000,
            max: 180000,
            step: 1000,
          },
          warningTime: {
            value: DEBUG_DEFAULTS.inactivity.warningTime,
            min: 1000,
            max: 60000,
            step: 1000,
          },
          overlayInitialScale: {
            value: DEBUG_DEFAULTS.inactivity.overlayInitialScale,
            min: 0.5,
            max: 1.2,
            step: 0.01,
          },
          overlayExitScale: {
            value: DEBUG_DEFAULTS.inactivity.overlayExitScale,
            min: 0.5,
            max: 1.2,
            step: 0.01,
          },
          panelOffsetY: {
            value: DEBUG_DEFAULTS.inactivity.panelOffsetY,
            min: -200,
            max: 200,
            step: 1,
          },
          animationDuration: {
            value: DEBUG_DEFAULTS.inactivity.animationDuration,
            min: 0,
            max: 2,
            step: 0.01,
          },
        },
        { collapsed: true }
      ),
    }),
    [detailItems, onJumpToGallery, onJumpToDetail, onJumpToAttractor, onShowInactivity, onHideInactivity]
  );

  return {
    layout: {
      backgroundTransitionDuration: controls.backgroundTransitionDuration ?? DEBUG_DEFAULTS.layout.backgroundTransitionDuration,
    },
    gallery: {
      scrollAmount: controls.scrollAmount ?? DEBUG_DEFAULTS.gallery.scrollAmount,
      animation: {
        delayChildren: controls.delayChildren ?? DEBUG_DEFAULTS.gallery.animation.delayChildren,
        staggerChildren: controls.staggerChildren ?? DEBUG_DEFAULTS.gallery.animation.staggerChildren,
        itemFadeDuration: controls.itemFadeDuration ?? DEBUG_DEFAULTS.gallery.animation.itemFadeDuration,
        exitDuration: controls.exitDuration ?? DEBUG_DEFAULTS.gallery.animation.exitDuration,
        exitYOffset: controls.exitYOffset ?? DEBUG_DEFAULTS.gallery.animation.exitYOffset,
      },
      mask: {
        enabled: controls.enabled ?? DEBUG_DEFAULTS.gallery.mask.enabled,
        fadeStrength: controls.fadeStrength ?? DEBUG_DEFAULTS.gallery.mask.fadeStrength,
        leftFadeWidth: controls.leftFadeWidth ?? DEBUG_DEFAULTS.gallery.mask.leftFadeWidth,
        rightFadeWidth: controls.rightFadeWidth ?? DEBUG_DEFAULTS.gallery.mask.rightFadeWidth,
      },
    },
    detail: {
      animation: {
        ...DEBUG_DEFAULTS.detail.animation,
        damping: controls.damping ?? DEBUG_DEFAULTS.detail.animation.damping,
        stiffness: controls.stiffness ?? DEBUG_DEFAULTS.detail.animation.stiffness,
      },
    },
    language: {
      screenDuration: controls.screenDuration ?? DEBUG_DEFAULTS.language.screenDuration,
      exitScale: controls.exitScale ?? DEBUG_DEFAULTS.language.exitScale,
      exitBlur: controls.exitBlur ?? DEBUG_DEFAULTS.language.exitBlur,
      logoInitialScale: controls.logoInitialScale ?? DEBUG_DEFAULTS.language.logoInitialScale,
      logoDuration: controls.logoDuration ?? DEBUG_DEFAULTS.language.logoDuration,
    },
    inactivity: {
      timeout: controls.timeout ?? DEBUG_DEFAULTS.inactivity.timeout,
      warningTime: controls.warningTime ?? DEBUG_DEFAULTS.inactivity.warningTime,
      overlayInitialScale: controls.overlayInitialScale ?? DEBUG_DEFAULTS.inactivity.overlayInitialScale,
      overlayExitScale: controls.overlayExitScale ?? DEBUG_DEFAULTS.inactivity.overlayExitScale,
      panelOffsetY: controls.panelOffsetY ?? DEBUG_DEFAULTS.inactivity.panelOffsetY,
      animationDuration: controls.animationDuration ?? DEBUG_DEFAULTS.inactivity.animationDuration,
    },
  };
}
