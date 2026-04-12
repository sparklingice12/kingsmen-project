/**
 * Heritage Codex Configuration
 * 
 * Encyclopedia entries about farming topics organized by category.
 * Each entry includes educational content, unlock conditions, and illustrations.
 * 
 * Requirements: 2.5.1, 2.5.6
 */

export const CODEX_CONFIG = {
    CATEGORIES: {
        CROPS: 'crops',
        SOIL: 'soil',
        SUSTAINABILITY: 'sustainability',
        HISTORY: 'history',
    },

    UNLOCK_CONDITIONS: {
        // Unlocked by default
        ALWAYS: 'always',
        // Unlocked when specific crop is planted
        PLANT_CROP: 'plant_crop',
        // Unlocked when specific crop is harvested
        HARVEST_CROP: 'harvest_crop',
        // Unlocked when player reaches certain day
        REACH_DAY: 'reach_day',
        // Unlocked when player earns certain coins
        EARN_COINS: 'earn_coins',
        // Unlocked when player plants diverse crops
        PLANT_DIVERSITY: 'plant_diversity',
    },
};

/**
 * Encyclopedia Entries
 * 
 * Each entry contains:
 * - id: Unique identifier
 * - title: Entry title
 * - category: One of CODEX_CONFIG.CATEGORIES
 * - content: 300-word educational content
 * - illustration: Path to illustration image
 * - unlockCondition: How to unlock this entry
 * - unlockValue: Value for unlock condition (e.g., crop type, day number)
 */
export const CODEX_ENTRIES = [
    // ===== CROPS CATEGORY =====
    {
        id: 'wheat-basics',
        title: 'Wheat: The Staff of Life',
        category: CODEX_CONFIG.CATEGORIES.CROPS,
        content: `Wheat has been cultivated for over 10,000 years and is one of the most important cereal crops in the world. It provides approximately 20% of the calories consumed by humans globally and is a staple food in many cultures.

There are several types of wheat, including hard red winter wheat (used for bread), soft white wheat (used for pastries), and durum wheat (used for pasta). Each variety has specific growing requirements and uses.

Wheat grows best in temperate climates with moderate rainfall. It requires well-drained soil and full sun exposure. The plant goes through several growth stages: germination, tillering, stem elongation, heading, flowering, and grain filling. From planting to harvest typically takes 90-120 days, depending on the variety and climate.

Wheat is rich in carbohydrates and provides essential nutrients including B vitamins, iron, and dietary fiber. Whole wheat products retain the bran and germ, making them more nutritious than refined wheat products.

In sustainable farming, wheat plays an important role in crop rotation. It helps break pest and disease cycles and can improve soil structure. Wheat stubble left after harvest also adds organic matter to the soil, enhancing its fertility for future crops.`,
        illustration: '/sprites/codex/wheat-lifecycle.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_CROP,
        unlockValue: 'wheat',
    },

    {
        id: 'carrot-cultivation',
        title: 'Carrots: Orange Powerhouses',
        category: CODEX_CONFIG.CATEGORIES.CROPS,
        content: `Carrots are root vegetables that originated in Persia (modern-day Iran and Afghanistan) over 1,000 years ago. Interestingly, the original carrots were purple or white, not orange! The orange variety we know today was developed by Dutch growers in the 17th century.

Carrots are biennial plants, meaning they complete their life cycle in two years. However, we harvest them in their first year for the edible root. If left in the ground, they would flower and produce seeds in their second year.

These vegetables thrive in loose, sandy soil that allows the roots to grow straight and deep. Heavy or rocky soil can cause carrots to become forked or stunted. They prefer cool weather and can tolerate light frosts, making them ideal for spring and fall planting.

Carrots are exceptionally nutritious, famous for their high beta-carotene content, which the body converts to vitamin A. This nutrient is essential for eye health, immune function, and skin health. One medium carrot provides more than 200% of the daily recommended vitamin A intake.

In sustainable agriculture, carrots are excellent companion plants. They can be grown alongside tomatoes, lettuce, and onions. Their deep taproots help break up compacted soil, improving soil structure for future crops. Carrot tops can also be composted to return nutrients to the soil.`,
        illustration: '/sprites/codex/carrot-growth.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_CROP,
        unlockValue: 'carrot',
    },

    {
        id: 'tomato-science',
        title: 'Tomatoes: Fruit or Vegetable?',
        category: CODEX_CONFIG.CATEGORIES.CROPS,
        content: `Tomatoes are botanically classified as fruits because they develop from the flower of the plant and contain seeds. However, in 1893, the U.S. Supreme Court ruled that tomatoes should be classified as vegetables for trade purposes, creating an interesting culinary versus botanical debate.

Native to western South America, tomatoes were first domesticated by the Aztecs and Incas. Spanish conquistadors brought them to Europe in the 16th century, where they were initially viewed with suspicion and even thought to be poisonous due to their relation to deadly nightshade plants.

Tomatoes are warm-season crops that require full sun and consistent moisture. They are indeterminate (vining) or determinate (bush) types. Indeterminate varieties continue growing and producing fruit throughout the season, while determinate varieties grow to a fixed size and produce all their fruit at once.

These plants need support structures like stakes or cages as they grow. They typically take 60-85 days from transplanting to produce ripe fruit. Tomatoes are sensitive to frost and should only be planted after the last spring frost date.

Nutritionally, tomatoes are rich in lycopene, a powerful antioxidant linked to reduced risk of heart disease and cancer. They also provide vitamins C and K, potassium, and folate. Cooking tomatoes actually increases the bioavailability of lycopene, making tomato sauce and paste particularly nutritious.`,
        illustration: '/sprites/codex/tomato-plant.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_CROP,
        unlockValue: 'tomato',
    },

    {
        id: 'bean-nitrogen',
        title: 'Beans: Nitrogen Fixers',
        category: CODEX_CONFIG.CATEGORIES.CROPS,
        content: `Beans belong to the legume family and possess a remarkable ability to improve soil health through nitrogen fixation. This process occurs through a symbiotic relationship with Rhizobium bacteria that live in nodules on the plant's roots.

These bacteria convert atmospheric nitrogen (which plants cannot use) into ammonia (which plants can absorb). This natural fertilization process can add 50-150 pounds of nitrogen per acre to the soil, reducing the need for synthetic fertilizers and benefiting subsequent crops.

There are many types of beans: snap beans (eaten pod and all), shell beans (seeds removed from pods), and dry beans (fully mature seeds). They originated in Central and South America and have been cultivated for over 7,000 years. Today, they are grown worldwide and are a dietary staple in many cultures.

Beans are warm-season crops that grow best in well-drained soil with full sun. Bush varieties grow compactly and don't need support, while pole varieties climb and require trellises or stakes. Most varieties are ready to harvest 50-60 days after planting.

Nutritionally, beans are powerhouses. They are excellent sources of plant-based protein, dietary fiber, folate, iron, and potassium. They have a low glycemic index, making them beneficial for blood sugar control. Regular bean consumption is associated with reduced risk of heart disease, diabetes, and certain cancers.`,
        illustration: '/sprites/codex/bean-roots.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_CROP,
        unlockValue: 'bean',
    },

    // ===== SOIL CATEGORY =====
    {
        id: 'soil-composition',
        title: 'Understanding Soil Composition',
        category: CODEX_CONFIG.CATEGORIES.SOIL,
        content: `Soil is not just dirt—it's a complex ecosystem teeming with life. Healthy soil contains minerals, organic matter, water, air, and billions of microorganisms. The composition of these elements determines soil quality and its ability to support plant growth.

Soil texture is determined by the proportion of sand, silt, and clay particles. Sandy soils have large particles that drain quickly but don't retain nutrients well. Clay soils have tiny particles that hold water and nutrients but can become waterlogged. Loam, a mixture of sand, silt, and clay, is considered ideal for most crops.

Organic matter, typically 2-10% of soil volume, is crucial for soil health. It comes from decomposed plant and animal materials and provides nutrients, improves soil structure, increases water retention, and supports beneficial microorganisms. Compost, manure, and cover crops are common sources of organic matter.

Soil pH affects nutrient availability. Most crops prefer slightly acidic to neutral soil (pH 6.0-7.0). If soil is too acidic or alkaline, certain nutrients become unavailable to plants even if present in the soil. Lime can raise pH, while sulfur can lower it.

The soil food web includes bacteria, fungi, protozoa, nematodes, arthropods, and earthworms. These organisms decompose organic matter, cycle nutrients, improve soil structure, and suppress plant diseases. A single teaspoon of healthy soil contains more microorganisms than there are people on Earth!`,
        illustration: '/sprites/codex/soil-layers.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.ALWAYS,
        unlockValue: null,
    },

    {
        id: 'composting',
        title: 'The Art of Composting',
        category: CODEX_CONFIG.CATEGORIES.SOIL,
        content: `Composting is nature's way of recycling organic materials into nutrient-rich soil amendment. It's one of the most important practices in sustainable gardening and farming, reducing waste while improving soil health.

The composting process requires four key ingredients: carbon-rich "brown" materials (dry leaves, straw, paper), nitrogen-rich "green" materials (fresh grass clippings, food scraps, coffee grounds), water, and oxygen. Microorganisms break down these materials, generating heat that can reach 130-160°F in the center of an active compost pile.

The ideal carbon-to-nitrogen ratio for composting is about 30:1. Too much carbon slows decomposition, while too much nitrogen creates odors. Turning the pile regularly introduces oxygen, which speeds up decomposition and prevents anaerobic conditions that cause unpleasant smells.

Finished compost is dark, crumbly, and earthy-smelling, typically ready in 2-6 months depending on conditions. It improves soil structure, increases water retention, provides slow-release nutrients, introduces beneficial microorganisms, and helps suppress plant diseases.

What to compost: fruit and vegetable scraps, coffee grounds, tea bags, eggshells, grass clippings, leaves, straw, and shredded paper. What NOT to compost: meat, dairy, oils, pet waste, diseased plants, or weeds with seeds. These can attract pests, create odors, or spread diseases and weeds.`,
        illustration: '/sprites/codex/compost-bin.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.REACH_DAY,
        unlockValue: 3,
    },

    {
        id: 'soil-erosion',
        title: 'Preventing Soil Erosion',
        category: CODEX_CONFIG.CATEGORIES.SOIL,
        content: `Soil erosion is the removal of topsoil by wind, water, or tillage. It's one of the most serious environmental problems facing agriculture today. Topsoil, which takes hundreds to thousands of years to form, can be lost in a single storm or growing season if not properly protected.

Water erosion occurs when rainfall or irrigation water flows across bare soil, carrying soil particles away. Sheet erosion removes thin layers uniformly, while rill and gully erosion creates channels. Wind erosion is most severe in dry, bare areas where soil particles are blown away, sometimes creating dust storms.

The consequences of erosion are severe: loss of fertile topsoil, reduced crop yields, sedimentation of waterways, increased flooding, and loss of soil carbon to the atmosphere. Globally, erosion affects about one-third of agricultural land and costs billions in lost productivity.

Prevention strategies include maintaining vegetative cover (plants protect soil from rain impact and wind), using cover crops during off-seasons, practicing no-till or reduced-till farming, creating terraces on slopes, planting windbreaks, and adding organic matter to improve soil structure.

Contour farming (plowing across slopes rather than up and down) and strip cropping (alternating strips of different crops) are effective on sloped land. Mulching protects soil surface, while buffer strips of permanent vegetation along waterways filter runoff and trap sediment before it reaches streams.`,
        illustration: '/sprites/codex/erosion-prevention.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.REACH_DAY,
        unlockValue: 5,
    },

    // ===== SUSTAINABILITY CATEGORY =====
    {
        id: 'crop-rotation',
        title: 'The Power of Crop Rotation',
        category: CODEX_CONFIG.CATEGORIES.SUSTAINABILITY,
        content: `Crop rotation is the practice of growing different types of crops in the same area across sequential seasons. This ancient technique, used for thousands of years, is fundamental to sustainable agriculture and offers numerous benefits for soil health and pest management.

Different crops have different nutrient requirements and root structures. For example, legumes add nitrogen to soil, while heavy feeders like corn deplete it. Deep-rooted crops access nutrients from lower soil layers, while shallow-rooted crops use surface nutrients. Rotating crops prevents nutrient depletion and maintains soil fertility.

Crop rotation breaks pest and disease cycles. Many pests and pathogens are crop-specific and build up in soil when the same crop is grown repeatedly. Rotating to a different crop family starves these organisms, reducing pest pressure without pesticides. For example, rotating away from tomatoes for 2-3 years helps control soil-borne tomato diseases.

A simple rotation might follow this pattern: Year 1 - legumes (beans, peas) to add nitrogen; Year 2 - heavy feeders (tomatoes, corn) that use that nitrogen; Year 3 - light feeders (carrots, onions); Year 4 - soil builders (cover crops). This cycle can then repeat.

Benefits extend beyond pest control and soil fertility. Rotation improves soil structure, increases organic matter, reduces erosion, decreases weed pressure, and can increase overall farm profitability. Modern research shows that diverse rotations also increase beneficial soil microorganisms and improve climate resilience.`,
        illustration: '/sprites/codex/crop-rotation-cycle.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_DIVERSITY,
        unlockValue: 3, // Plant 3 different crop types
    },

    {
        id: 'water-conservation',
        title: 'Smart Water Management',
        category: CODEX_CONFIG.CATEGORIES.SUSTAINABILITY,
        content: `Agriculture accounts for about 70% of global freshwater use, making water conservation critical for sustainable farming. Smart water management practices can reduce water use while maintaining or even improving crop yields.

Drip irrigation delivers water directly to plant roots through a network of tubes and emitters. This method can reduce water use by 30-50% compared to traditional sprinkler systems by minimizing evaporation and runoff. It also reduces weed growth and disease by keeping foliage dry.

Mulching is one of the simplest water conservation techniques. A 2-4 inch layer of organic mulch (straw, wood chips, leaves) or plastic mulch reduces evaporation, moderates soil temperature, suppresses weeds, and adds organic matter as it decomposes. Mulch can reduce watering needs by up to 50%.

Soil improvement is fundamental to water conservation. Healthy soil with good structure and high organic matter content acts like a sponge, holding water and making it available to plants. Adding compost increases water-holding capacity—each 1% increase in soil organic matter helps soil hold 20,000 more gallons of water per acre.

Timing matters too. Watering early morning reduces evaporation loss. Deep, infrequent watering encourages deep root growth, making plants more drought-resistant. Monitoring soil moisture prevents overwatering, which wastes water and can harm plants. Collecting rainwater in barrels or cisterns provides free irrigation water and reduces runoff.`,
        illustration: '/sprites/codex/drip-irrigation.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.REACH_DAY,
        unlockValue: 4,
    },

    {
        id: 'biodiversity',
        title: 'Biodiversity in Agriculture',
        category: CODEX_CONFIG.CATEGORIES.SUSTAINABILITY,
        content: `Biodiversity—the variety of life in an ecosystem—is essential for resilient, productive agriculture. Diverse farms are more stable, productive, and better able to withstand pests, diseases, and climate variability than monocultures.

Crop diversity provides multiple benefits. Growing many crop varieties spreads risk—if one crop fails, others may succeed. Different crops attract different beneficial insects, creating a balanced ecosystem. Diverse plantings also provide varied habitats for pollinators, predatory insects, and other wildlife that support agriculture.

Beneficial insects are natural pest controllers. Ladybugs eat aphids, lacewings consume many soft-bodied pests, and parasitic wasps control caterpillars. Flowering plants provide nectar and pollen for these beneficial insects. A diverse farm can reduce pesticide needs by 50% or more through natural pest control.

Pollinators are critical for many crops. Bees, butterflies, moths, beetles, and other pollinators are responsible for one-third of global food production. Creating pollinator habitat with diverse flowering plants, nesting sites, and pesticide-free zones supports these essential creatures.

Soil biodiversity is equally important. Diverse soil organisms improve nutrient cycling, soil structure, and plant health. Practices that support soil biodiversity include minimizing tillage, maintaining plant cover, adding organic matter, and avoiding excessive pesticide use. Healthy soil biology can increase crop yields by 10-30% while reducing input costs.`,
        illustration: '/sprites/codex/biodiversity-farm.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.PLANT_DIVERSITY,
        unlockValue: 4, // Plant 4 different crop types
    },

    {
        id: 'integrated-pest-management',
        title: 'Integrated Pest Management',
        category: CODEX_CONFIG.CATEGORIES.SUSTAINABILITY,
        content: `Integrated Pest Management (IPM) is an ecosystem-based strategy that focuses on long-term prevention of pests through a combination of techniques. Rather than relying solely on pesticides, IPM uses multiple tactics to keep pest populations below economically damaging levels.

The IPM approach follows a hierarchy: prevention first, then monitoring, then intervention only when necessary, using the least toxic methods first. This reduces pesticide use, saves money, protects beneficial organisms, and minimizes environmental impact.

Prevention strategies include selecting pest-resistant crop varieties, using crop rotation to break pest cycles, maintaining healthy soil to grow vigorous plants, timing plantings to avoid peak pest periods, and using physical barriers like row covers or netting.

Monitoring involves regular field scouting to identify pests and assess population levels. Not all pests require treatment—many are present at levels that don't cause economic damage. Action thresholds help farmers decide when intervention is necessary based on pest numbers and crop value.

When intervention is needed, IPM prioritizes non-chemical methods: hand-picking pests, using traps, introducing or encouraging natural predators, applying biological controls (beneficial insects, bacteria, fungi), and using mechanical controls like cultivation or mowing. Chemical pesticides are used only as a last resort, choosing the most selective, least toxic options.

IPM has proven highly effective. Farms using IPM typically reduce pesticide use by 50-90% while maintaining or improving yields. This approach protects farmworker health, reduces costs, preserves beneficial insects, and minimizes environmental contamination.`,
        illustration: '/sprites/codex/ipm-pyramid.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.HARVEST_CROP,
        unlockValue: 'any', // Harvest any crop
    },

    // ===== HISTORY CATEGORY =====
    {
        id: 'agricultural-revolution',
        title: 'The Agricultural Revolution',
        category: CODEX_CONFIG.CATEGORIES.HISTORY,
        content: `The Agricultural Revolution, beginning around 10,000 BCE, marks humanity's transition from nomadic hunting and gathering to settled farming. This transformation fundamentally changed human society, leading to permanent settlements, population growth, and the development of civilization.

The revolution began independently in several regions: the Fertile Crescent (wheat, barley, lentils), China (rice, millet), Mesoamerica (corn, beans, squash), and the Andes (potatoes, quinoa). Each region domesticated local wild plants through selective breeding, gradually developing the crops we know today.

Early farmers discovered that saving seeds from the best plants led to improved crops over generations. They learned to clear land, prepare soil, irrigate fields, and store surplus food. These innovations allowed populations to grow and settle in one place, leading to the first villages and eventually cities.

The Agricultural Revolution had profound consequences. Surplus food enabled specialization—not everyone needed to farm, allowing development of crafts, trade, writing, and governance. However, it also brought challenges: dependence on fewer food sources, vulnerability to crop failures, increased disease transmission in dense populations, and social inequality.

Modern agriculture still builds on these ancient foundations. Many crops we grow today were domesticated thousands of years ago. Understanding this history helps us appreciate the long relationship between humans and plants, and reminds us that agriculture is constantly evolving to meet new challenges.`,
        illustration: '/sprites/codex/ancient-farming.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.ALWAYS,
        unlockValue: null,
    },

    {
        id: 'indigenous-farming',
        title: 'Indigenous Farming Wisdom',
        category: CODEX_CONFIG.CATEGORIES.HISTORY,
        content: `Indigenous peoples worldwide developed sophisticated agricultural systems over thousands of years, many of which remain relevant to sustainable farming today. These systems were based on deep observation of nature, intergenerational knowledge, and respect for the land.

The "Three Sisters" method, practiced by many Native American tribes, exemplifies indigenous agricultural wisdom. Corn, beans, and squash are planted together: corn provides a structure for beans to climb, beans fix nitrogen in the soil, and squash leaves shade the ground, retaining moisture and suppressing weeds. This polyculture produces more food per acre than monocultures.

Terracing, developed independently by the Inca, Chinese, and other cultures, transforms steep hillsides into productive farmland while preventing erosion. These ancient terraces, some over 2,000 years old, still produce crops today, demonstrating the sustainability of indigenous engineering.

Indigenous farmers developed thousands of crop varieties adapted to local conditions. The Andes alone have over 4,000 potato varieties, each suited to different elevations, climates, and uses. This diversity provided food security—if one variety failed, others would survive.

Traditional ecological knowledge includes understanding seasonal patterns, reading weather signs, managing water resources, maintaining soil fertility through composting and crop rotation, and preserving seed diversity. Many modern sustainable farming practices are rediscoveries of indigenous methods.

Today, there's growing recognition that indigenous agricultural knowledge is valuable for addressing climate change, biodiversity loss, and food security. Combining traditional wisdom with modern science offers promising paths toward truly sustainable agriculture.`,
        illustration: '/sprites/codex/three-sisters.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.EARN_COINS,
        unlockValue: 100,
    },

    {
        id: 'green-revolution',
        title: 'The Green Revolution',
        category: CODEX_CONFIG.CATEGORIES.HISTORY,
        content: `The Green Revolution, spanning the 1950s-1970s, dramatically increased agricultural production worldwide through new technologies, particularly high-yielding crop varieties, synthetic fertilizers, and irrigation. This transformation prevented predicted famines and fed billions, but also brought environmental and social challenges.

Norman Borlaug, often called the "Father of the Green Revolution," developed semi-dwarf wheat varieties that produced more grain and were resistant to lodging (falling over). These varieties, combined with fertilizers and irrigation, doubled or tripled yields in many regions. Borlaug received the Nobel Peace Prize in 1970 for his work.

The revolution spread rapidly. India, facing severe food shortages in the 1960s, adopted new wheat and rice varieties. Within a decade, India became self-sufficient in grain production. Similar transformations occurred across Asia and Latin America, averting widespread famine and saving an estimated one billion lives.

However, the Green Revolution had drawbacks. It required expensive inputs (seeds, fertilizers, pesticides, irrigation) that many small farmers couldn't afford, increasing inequality. Heavy fertilizer and pesticide use caused environmental problems: water pollution, soil degradation, and biodiversity loss. The focus on a few high-yielding varieties reduced crop diversity, making agriculture more vulnerable to pests and climate change.

Today's challenge is developing a "Second Green Revolution" that increases food production sustainably. This involves improving crop genetics through both traditional breeding and biotechnology, using precision agriculture to reduce input waste, developing climate-resilient varieties, and incorporating agroecological practices that work with nature rather than against it.`,
        illustration: '/sprites/codex/green-revolution.png',
        unlockCondition: CODEX_CONFIG.UNLOCK_CONDITIONS.REACH_DAY,
        unlockValue: 7,
    },
];

/**
 * Get entries by category
 */
export function getEntriesByCategory(category) {
    return CODEX_ENTRIES.filter(entry => entry.category === category);
}

/**
 * Get entry by ID
 */
export function getEntryById(id) {
    return CODEX_ENTRIES.find(entry => entry.id === id);
}

/**
 * Get all categories with entry counts
 */
export function getCategoriesWithCounts() {
    const counts = {};
    Object.values(CODEX_CONFIG.CATEGORIES).forEach(category => {
        counts[category] = CODEX_ENTRIES.filter(e => e.category === category).length;
    });
    return counts;
}
