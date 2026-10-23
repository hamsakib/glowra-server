/**
 * Catalogue seed. Every product is a real, widely sold Korean skincare item.
 * Copy is original to this project; prices are typical Bangladeshi retail in BDT.
 * `seller: "user"` marks listings owned by the demo user account (so "My Listings" has data).
 */
export const categories = [
  { name: "Cleansers", slug: "cleansers", order: 1, description: "Gel, foam, oil and balm cleansers for a clean start without the tight feeling." },
  { name: "Toners & Essences", slug: "toners", order: 2, description: "Watery layers that hydrate, calm or gently exfoliate after cleansing." },
  { name: "Serums & Ampoules", slug: "serums", order: 3, description: "Concentrated treatments for spots, dullness, dehydration and breakouts." },
  { name: "Moisturizers", slug: "moisturizers", order: 4, description: "Creams and gels that seal in water and support the skin barrier." },
  { name: "Sunscreen", slug: "sunscreen", order: 5, description: "Light, high-protection SPF that works in heat and humidity." },
  { name: "Masks & Treatments", slug: "masks", order: 6, description: "Sheet masks, overnight masks and spot patches for extra care." },
];

export const products = [
  // ---------------- Cleansers ----------------
  {
    title: "COSRX Low pH Good Morning Gel Cleanser",
    brand: "COSRX", category: "cleansers", size: "150ml", price: 950, compareAtPrice: 1150, stock: 64, featured: true,
    shortDescription: "A mildly acidic gel cleanser with tea tree and BHA that cleans without stripping.",
    description:
      "Most foaming cleansers sit at a pH far above the skin's natural level, which is why the face can feel squeaky and tight afterwards. This gel is formulated close to skin's own pH, so it removes sweat, sunscreen residue and excess oil while leaving the barrier comfortable. A small amount of betaine salicylate helps keep pores clear and tea tree oil gives it a fresh, herbal scent. It lathers lightly, rinses fast and is gentle enough for twice-daily use, including on oily and acne-prone skin.",
    howToUse: "Massage a pea-sized amount onto damp skin for 30 seconds, then rinse with lukewarm water. Use morning and night.",
    keyIngredients: ["Betaine Salicylate", "Tea Tree Leaf Oil", "Allantoin"],
    skinTypes: ["oily", "combination", "normal"], concerns: ["acne", "pores"],
  },
  {
    title: "Anua Heartleaf Pore Control Cleansing Oil",
    brand: "Anua", category: "cleansers", size: "200ml", price: 1850, compareAtPrice: 2200, stock: 38, featured: true,
    shortDescription: "A lightweight first-cleanse oil that melts sunscreen and loosens blackheads.",
    description:
      "An oil cleanser is the easiest way to remove water-resistant sunscreen and makeup, and this one is light enough that people with oily skin actually enjoy using it. Heartleaf (houttuynia cordata) extract calms redness while a blend of plant oils dissolves sebum plugs, so regular use leaves the nose and chin feeling smoother. It emulsifies into a milky liquid as soon as water touches it and rinses off clean, with no greasy film left behind.",
    howToUse: "Apply 2 pumps to dry skin with dry hands and massage for a minute, focusing on the nose and chin. Add a little water to emulsify, rinse, then follow with a water-based cleanser.",
    keyIngredients: ["Heartleaf Extract", "Sunflower Seed Oil", "Olive Oil"],
    skinTypes: ["oily", "combination", "normal", "dry"], concerns: ["pores", "acne"],
  },
  {
    title: "Round Lab 1025 Dokdo Cleanser",
    brand: "Round Lab", category: "cleansers", size: "150ml", price: 1250, compareAtPrice: 1500, stock: 42,
    shortDescription: "A soft foam cleanser made with deep sea water from Ulleungdo for balanced, calm skin.",
    description:
      "Round Lab's best-known cleanser produces a dense, cushiony foam that cleans thoroughly but rinses without a dry after-feel. Mineral-rich deep sea water and a mild amino-acid surfactant system make it suitable for daily use, while a touch of exfoliating PHA keeps texture smooth over time. It is a dependable second cleanser for normal and combination skin and is gentle enough for sensitive skin that dislikes stronger foams.",
    howToUse: "Lather a small amount with water in your palms, massage onto the face and rinse thoroughly.",
    keyIngredients: ["Ulleungdo Deep Sea Water", "PHA", "Panthenol"],
    skinTypes: ["normal", "combination", "sensitive"], concerns: ["dullness", "pores"],
  },
  {
    title: "Beauty of Joseon Green Plum Refreshing Cleanser",
    brand: "Beauty of Joseon", category: "cleansers", size: "100ml", price: 1150, compareAtPrice: 1350, stock: 30,
    shortDescription: "A gel-to-foam cleanser with green plum water and a hint of AHA and BHA.",
    description:
      "Green plum is a traditional Korean ingredient prized for its fresh acidity, and here it forms the base of a gel that turns into a fine, low-foaming lather. Small amounts of AHA and BHA help sweep away dead cells for brighter-looking skin, while the low-pH formula avoids that stripped feeling. The tube is compact and travel friendly, and the scent is lightly fruity rather than perfumed.",
    howToUse: "Work a small amount into a lather with water, massage gently and rinse. Suitable for morning and evening use.",
    keyIngredients: ["Green Plum Fruit Water", "Lactic Acid", "Salicylic Acid"],
    skinTypes: ["oily", "combination", "normal"], concerns: ["dullness", "pores"],
  },
  {
    title: "Banila Co Clean It Zero Cleansing Balm Original",
    brand: "Banila Co", category: "cleansers", size: "100ml", price: 1950, compareAtPrice: 2400, stock: 26,
    shortDescription: "The sherbet-textured cleansing balm that dissolves even long-wear makeup in seconds.",
    description:
      "This balm starts solid in the jar, turns into a silky oil when it touches warm skin and rinses away as a milk. It breaks down heavy makeup, mascara and water-resistant sunscreen quickly, which means less rubbing around the eyes. Acerola and papaya extracts add a mild brightening touch. A spatula is included to keep the jar hygienic. Ideal as the first step of a double cleanse on days you wear makeup or high-SPF sunscreen.",
    howToUse: "Scoop a small amount with the spatula, massage onto dry skin, emulsify with water and rinse. Follow with a foam or gel cleanser.",
    keyIngredients: ["Acerola Extract", "Papaya Extract", "Vitamin C Derivative"],
    skinTypes: ["normal", "dry", "combination"], concerns: ["dullness"],
  },

  // ---------------- Toners ----------------
  {
    title: "Anua Heartleaf 77% Soothing Toner",
    brand: "Anua", category: "toners", size: "250ml", price: 1950, compareAtPrice: 2300, stock: 55, featured: true,
    shortDescription: "A watery toner with 77% heartleaf extract to calm redness and irritation.",
    description:
      "With heartleaf extract making up the majority of the formula, this toner is built to take the heat out of irritated skin. It has a thin, water-like texture that absorbs instantly, making it easy to layer two or three times on days your skin feels reactive. It is fragrance-free and has a short ingredient list, which makes it a safe choice when introducing a new active or recovering from too much exfoliation.",
    howToUse: "After cleansing, pat onto skin with hands or apply with a cotton pad. Layer up to three times for extra hydration.",
    keyIngredients: ["Heartleaf Extract 77%", "Panthenol", "Betaine"],
    skinTypes: ["sensitive", "oily", "combination", "normal"], concerns: ["redness", "acne"],
  },
  {
    title: "SKIN1004 Madagascar Centella Hyalu-Cica Brightening Toner",
    brand: "SKIN1004", category: "toners", size: "210ml", price: 1650, compareAtPrice: 1950, stock: 40,
    shortDescription: "Centella and hyaluronic acid in a light toner that hydrates and evens tone.",
    description:
      "SKIN1004 builds its range around centella asiatica sourced from Madagascar, and this toner pairs it with several weights of hyaluronic acid for hydration that sinks in rather than sitting on top. Niacinamide is added to help even out skin tone over time. The finish is fresh and slightly dewy, comfortable for humid weather and easy to layer under serums and sunscreen.",
    howToUse: "Pour a small amount into your palms and press into clean skin. Follow with serum and moisturizer.",
    keyIngredients: ["Centella Asiatica Extract", "Hyaluronic Acid", "Niacinamide"],
    skinTypes: ["normal", "combination", "oily", "sensitive"], concerns: ["dehydration", "dullness", "redness"],
  },
  {
    title: "Round Lab 1025 Dokdo Toner",
    brand: "Round Lab", category: "toners", size: "200ml", price: 1550, compareAtPrice: 1800, stock: 34,
    shortDescription: "A mild exfoliating toner that hydrates and smooths with deep sea water.",
    description:
      "A cult toner in Korea for its balance of gentle exfoliation and hydration. Deep sea water provides minerals, while a low level of PHA lifts dead skin without the sting of stronger acids. Many people use it on a cotton pad in the morning to clear away overnight residue and then pat a second layer on by hand for moisture. It is unscented and works well under any routine.",
    howToUse: "Swipe over the face with a cotton pad after cleansing, then pat in a second layer with your hands.",
    keyIngredients: ["Ulleungdo Deep Sea Water", "PHA", "Hyaluronic Acid"],
    skinTypes: ["normal", "combination", "dry", "sensitive"], concerns: ["dullness", "dehydration"],
  },
  {
    title: "COSRX AHA/BHA Clarifying Treatment Toner",
    brand: "COSRX", category: "toners", size: "150ml", price: 1250, compareAtPrice: 1450, stock: 47,
    shortDescription: "An exfoliating toner with low-level acids for smoother texture and clearer pores.",
    description:
      "This toner combines glycolic acid with a BHA to loosen dead cells on the surface and inside pores. The concentrations are kept low, so it suits people who are new to exfoliating acids. Willow bark water and purslane extract soften the formula. Used a few evenings a week it helps with rough patches, blackheads and the flat marks left after breakouts. Pair it with daily sunscreen.",
    howToUse: "In the evening, apply with a cotton pad after cleansing. Start with 2 to 3 times a week and build up as tolerated.",
    keyIngredients: ["Glycolic Acid", "Betaine Salicylate", "Willow Bark Water"],
    skinTypes: ["oily", "combination", "normal"], concerns: ["pores", "acne", "dullness"],
  },
  {
    title: "Isntree Hyaluronic Acid Toner",
    brand: "Isntree", category: "toners", size: "200ml", price: 1450, compareAtPrice: 1650, stock: 22, seller: "user",
    shortDescription: "A slightly viscous toner with multiple hyaluronic acids for deep, lasting hydration.",
    description:
      "Isntree's hydrating toner uses eight types of hyaluronic acid with different molecular sizes, so moisture is delivered at more than one depth. The texture is a little thicker than water, closer to a light essence, and it leaves skin plump without stickiness. It is a good fit for air-conditioned offices and winter months when skin feels tight by midday, and gentle enough for sensitive skin.",
    howToUse: "Pat 2 to 3 drops into skin after cleansing. Layer again on dry areas.",
    keyIngredients: ["8 Types of Hyaluronic Acid", "Centella Asiatica", "Panthenol"],
    skinTypes: ["dry", "normal", "sensitive", "combination"], concerns: ["dehydration"],
  },

  // ---------------- Serums ----------------
  {
    title: "COSRX Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX", category: "serums", size: "100ml", price: 1450, compareAtPrice: 1800, stock: 72, featured: true,
    shortDescription: "The bestselling snail essence for hydration, bounce and faster-looking recovery.",
    description:
      "Snail secretion filtrate makes up 96% of this essence, giving it a smooth, slightly stretchy texture that absorbs into a soft, hydrated finish. It is known for helping skin look calmer and more even, especially after breakouts, and it plays well with almost every other product. Because it is lightweight and fragrance-free, it works for oily skin in humid weather as well as for dry skin under a richer cream.",
    howToUse: "After toner, apply a small amount and pat until absorbed. Use morning and night.",
    keyIngredients: ["Snail Secretion Filtrate 96%", "Sodium Hyaluronate", "Allantoin"],
    skinTypes: ["oily", "dry", "combination", "normal", "sensitive"], concerns: ["dehydration", "acne", "dullness"],
  },
  {
    title: "Beauty of Joseon Glow Serum: Propolis + Niacinamide",
    brand: "Beauty of Joseon", category: "serums", size: "30ml", price: 1350, compareAtPrice: 1600, stock: 58, featured: true,
    shortDescription: "Propolis and niacinamide for a calmer, more even complexion with a soft glow.",
    description:
      "Propolis is a resin made by bees with soothing properties, and here it is paired with niacinamide, one of the most studied ingredients for oil control and uneven tone. The result is a honey-coloured serum that feels light, calms the look of active breakouts and gives skin a healthy sheen without shine. It is a gentle first treatment serum for anyone dealing with oiliness and post-acne marks at the same time.",
    howToUse: "Apply 2 to 3 drops after toner, morning and evening. Follow with moisturizer, and sunscreen during the day.",
    keyIngredients: ["Propolis Extract 60%", "Niacinamide 2%", "Tea Tree Leaf Water"],
    skinTypes: ["oily", "combination", "normal"], concerns: ["acne", "dark-spots", "dullness"],
  },
  {
    title: "Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum",
    brand: "Torriden", category: "serums", size: "50ml", price: 1650, compareAtPrice: 1950, stock: 36,
    shortDescription: "Five types of low-molecular hyaluronic acid for weightless, all-day hydration.",
    description:
      "Torriden's DIVE-IN serum is designed to hydrate without the tacky finish some hyaluronic serums leave. Five forms of hyaluronic acid are combined with panthenol and allantoin to support the barrier. The texture is clear and fluid, so it can be applied generously and layered under makeup. It is especially useful for oily but dehydrated skin that feels tight even when it looks shiny.",
    howToUse: "Apply to damp skin after toner and pat in. Seal with a moisturizer.",
    keyIngredients: ["Low Molecular Hyaluronic Acid", "D-Panthenol", "Allantoin"],
    skinTypes: ["oily", "dry", "combination", "normal", "sensitive"], concerns: ["dehydration"],
  },
  {
    title: "SKIN1004 Madagascar Centella Ampoule",
    brand: "SKIN1004", category: "serums", size: "55ml", price: 1450, compareAtPrice: 1700, stock: 44,
    shortDescription: "A one-ingredient centella ampoule that soothes sensitive, stressed skin.",
    description:
      "The ingredient list is about as short as skincare gets: centella asiatica extract and very little else. That simplicity is the point. It is a calming step for skin that reacts to almost everything, a comforting layer after sun exposure, and a gentle partner for stronger treatments like exfoliating acids. The watery texture sinks in within seconds and leaves no residue.",
    howToUse: "After toner, apply a few drops and pat gently. Can be used morning and night.",
    keyIngredients: ["Centella Asiatica Extract 100%"],
    skinTypes: ["sensitive", "oily", "combination", "normal", "dry"], concerns: ["redness", "acne"],
  },
  {
    title: "Some By Mi AHA-BHA-PHA 30 Days Miracle Serum",
    brand: "Some By Mi", category: "serums", size: "50ml", price: 1350, compareAtPrice: 1650, stock: 33,
    shortDescription: "A gentle triple-acid serum with tea tree for breakout-prone skin.",
    description:
      "This serum combines three types of exfoliating acid at low levels with tea tree extract, aiming to keep pores clear and reduce the look of blemishes over a month of consistent use. Centella and niacinamide help balance the formula so it stays gentle enough for daily use. The texture is a light gel with a faint herbal scent. A practical step for oily skin that breaks out in heat and humidity.",
    howToUse: "Apply after toner in the evening. Start every other night, then increase to daily if your skin is comfortable. Always use sunscreen the next day.",
    keyIngredients: ["AHA", "BHA", "PHA", "Tea Tree Extract"],
    skinTypes: ["oily", "combination"], concerns: ["acne", "pores"],
  },
  {
    title: "Axis-Y Dark Spot Correcting Glow Serum",
    brand: "Axis-Y", category: "serums", size: "50ml", price: 1550, compareAtPrice: 1850, stock: 28, seller: "user",
    shortDescription: "Niacinamide and rice bran in a lightweight serum that targets dark spots.",
    description:
      "Formulated for post-acne marks and uneven patches, this serum pairs 5% niacinamide with brightening plant extracts such as rice bran water and a vitamin C derivative. It has a milky, fast-absorbing texture that layers well under sunscreen. Results build gradually; most people see a more even tone after several weeks of daily use, provided sunscreen is part of the routine.",
    howToUse: "Apply 2 to 3 drops to clean skin morning and night. Follow with moisturizer and SPF in the morning.",
    keyIngredients: ["Niacinamide 5%", "Rice Bran Water", "Ascorbyl Glucoside"],
    skinTypes: ["oily", "combination", "normal", "dry"], concerns: ["dark-spots", "dullness"],
  },

  // ---------------- Moisturizers ----------------
  {
    title: "COSRX Advanced Snail 92 All in One Cream",
    brand: "COSRX", category: "moisturizers", size: "100g", price: 1550, compareAtPrice: 1850, stock: 50, featured: true,
    shortDescription: "A bouncy gel-cream with snail mucin that moisturises without heaviness.",
    description:
      "This cream has a jelly-like texture that melts into skin and leaves a soft, hydrated finish rather than a greasy one. Snail secretion filtrate helps skin look smoother and more resilient, and the formula is fragrance-free. It works as a daytime moisturizer under sunscreen for oily and combination skin, or as a lighter night cream for normal skin.",
    howToUse: "Apply an even layer as the last step of your routine before sunscreen in the morning, or as the final step at night.",
    keyIngredients: ["Snail Secretion Filtrate 92%", "Betaine", "Sodium Hyaluronate"],
    skinTypes: ["oily", "combination", "normal"], concerns: ["dehydration", "dullness"],
  },
  {
    title: "Illiyoon Ceramide Ato Concentrate Cream",
    brand: "Illiyoon", category: "moisturizers", size: "200ml", price: 1950, compareAtPrice: 2300, stock: 31,
    shortDescription: "A rich ceramide cream for very dry, flaky or sensitive skin, face and body.",
    description:
      "Illiyoon's ceramide cream comes in a generous tube that works on both face and body. A ceramide capsule technology delivers barrier lipids that help skin hold on to water, and the result is long-lasting comfort for dry, rough or itchy patches. It is fragrance-free and gentle enough for the whole family, which makes it a staple during Dhaka's dry winter months.",
    howToUse: "Apply generously to face and body after bathing or as needed throughout the day.",
    keyIngredients: ["Ceramide Capsule", "Glycerin", "Squalane"],
    skinTypes: ["dry", "sensitive", "normal"], concerns: ["dehydration", "redness"],
  },
  {
    title: "Round Lab Birch Juice Moisturizing Cream",
    brand: "Round Lab", category: "moisturizers", size: "80ml", price: 1750, compareAtPrice: 2050, stock: 24,
    shortDescription: "Birch sap and hyaluronic acid in a light cream that keeps skin dewy.",
    description:
      "Birch sap is naturally rich in minerals and amino acids, and Round Lab uses it as the water base of this moisturizer. Combined with hyaluronic acid, it gives a fresh, cushiony finish that keeps skin hydrated through the day without feeling heavy. It is a good everyday cream for normal and dehydrated skin and works well under makeup.",
    howToUse: "Apply a coin-sized amount after serum and gently pat in.",
    keyIngredients: ["Birch Sap", "Hyaluronic Acid", "Ceramide NP"],
    skinTypes: ["normal", "combination", "dry"], concerns: ["dehydration"],
  },
  {
    title: "Beauty of Joseon Dynasty Cream",
    brand: "Beauty of Joseon", category: "moisturizers", size: "50ml", price: 1650, compareAtPrice: 1950, stock: 27,
    shortDescription: "A hanbang-inspired cream with rice bran water and ginseng for a healthy glow.",
    description:
      "Inspired by traditional Korean herbal skincare, the Dynasty Cream blends rice bran water, ginseng water and squalane into a rich but non-greasy cream. It leaves a subtle, healthy-looking radiance and helps skin feel firm and comfortable. It is a natural fit for normal to dry skin and for anyone who wants a nourishing night cream without a heavy perfume.",
    howToUse: "Apply as the last step of your evening routine, or in the morning before sunscreen.",
    keyIngredients: ["Rice Bran Water", "Ginseng Water", "Squalane"],
    skinTypes: ["normal", "dry", "combination"], concerns: ["aging", "dullness", "dehydration"],
  },
  {
    title: "Klairs Midnight Blue Calming Cream",
    brand: "Klairs", category: "moisturizers", size: "60ml", price: 1850, compareAtPrice: 2200, stock: 19,
    shortDescription: "A blue-tinted soothing cream that comforts redness and over-exfoliated skin.",
    description:
      "The blue colour comes from guaiazulene, a compound derived from chamomile that is known for its calming effect. Together with centella, it makes this cream a go-to after sun exposure, shaving or a routine that went a little too hard on acids. The texture is a soft cream that spreads easily and leaves skin comfortable. It is suitable for sensitive and acne-prone skin.",
    howToUse: "Apply to areas of redness or irritation, or use all over as the last step at night.",
    keyIngredients: ["Guaiazulene", "Centella Asiatica", "Ceramide"],
    skinTypes: ["sensitive", "combination", "normal", "dry"], concerns: ["redness"],
  },

  // ---------------- Sunscreen ----------------
  {
    title: "Beauty of Joseon Relief Sun: Rice + Probiotics SPF50+ PA++++",
    brand: "Beauty of Joseon", category: "sunscreen", size: "50ml", price: 1350, compareAtPrice: 1600, stock: 80, featured: true,
    shortDescription: "A creamy organic-filter sunscreen that feels like a light moisturiser, no white cast.",
    description:
      "One of the most popular sunscreens in the world, and for good reason. Rice extract and grain ferments give it a comfortable, moisturising texture that dries down to a natural finish without a grey cast on medium and deep skin tones. It offers SPF50+ and PA++++ protection, covering both burning rays and the UVA that drives tanning and dark spots. Pleasant enough to reapply during the day, which is what makes sunscreen actually work.",
    howToUse: "Apply two finger-lengths to face and neck as the last step of your morning routine. Reapply every 2 to 3 hours outdoors.",
    keyIngredients: ["Rice Extract", "Grain Ferment", "Niacinamide"],
    skinTypes: ["normal", "dry", "combination", "sensitive"], concerns: ["sun-protection", "dark-spots"],
  },
  {
    title: "SKIN1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF50+",
    brand: "SKIN1004", category: "sunscreen", size: "50ml", price: 1450, compareAtPrice: 1750, stock: 62, featured: true,
    shortDescription: "A watery sun serum with centella that disappears on oily skin in humid weather.",
    description:
      "This sunscreen has a serum-like texture that spreads quickly and sets to a light, almost invisible finish. Centella and hyaluronic acid keep skin calm and hydrated while SPF50+ PA++++ filters provide broad protection. Because it feels so light, it is a favourite for oily and combination skin in hot, humid climates, and it sits well under makeup without pilling.",
    howToUse: "Apply generously as the final skincare step in the morning. Reapply after sweating or every 2 to 3 hours outdoors.",
    keyIngredients: ["Centella Asiatica", "Hyaluronic Acid", "Broad-Spectrum UV Filters"],
    skinTypes: ["oily", "combination", "normal", "sensitive"], concerns: ["sun-protection"],
  },
  {
    title: "Round Lab Birch Juice Moisturizing Sun Cream SPF45",
    brand: "Round Lab", category: "sunscreen", size: "50ml", price: 1550, compareAtPrice: 1800, stock: 35,
    shortDescription: "A hydrating sunscreen with birch sap for dry and dehydrated skin.",
    description:
      "For skin that feels tight under mattifying sunscreens, this cream offers SPF45 PA++++ protection in a hydrating base of birch sap and hyaluronic acid. It leaves a dewy, comfortable finish and doubles as a light moisturiser on humid days. A good everyday option for dry and normal skin, and for winter when other sunscreens feel drying.",
    howToUse: "Apply evenly to face and neck as the last step of your morning routine. Reapply as needed.",
    keyIngredients: ["Birch Sap", "Hyaluronic Acid", "UV Filters"],
    skinTypes: ["dry", "normal", "combination"], concerns: ["sun-protection", "dehydration"],
  },
  {
    title: "Isntree Hyaluronic Acid Watery Sun Gel SPF50+",
    brand: "Isntree", category: "sunscreen", size: "50ml", price: 1450, compareAtPrice: 1700, stock: 41,
    shortDescription: "A refreshing gel sunscreen with hyaluronic acid and no white cast.",
    description:
      "This gel sunscreen has a cooling, water-like feel and absorbs in seconds. Hyaluronic acid adds hydration so skin does not feel dry by afternoon, while SPF50+ PA++++ keeps protection high. It leaves no white cast and has a natural finish that suits all skin tones. A dependable everyday sunscreen for anyone who hates the feeling of wearing one.",
    howToUse: "Apply a generous layer 15 minutes before going outside. Reapply every 2 to 3 hours.",
    keyIngredients: ["Hyaluronic Acid", "Green Tea Extract", "UV Filters"],
    skinTypes: ["oily", "combination", "normal", "sensitive"], concerns: ["sun-protection"],
  },

  // ---------------- Masks & Treatments ----------------
  {
    title: "Laneige Lip Sleeping Mask Berry",
    brand: "Laneige", category: "masks", size: "20g", price: 1650, compareAtPrice: 1950, stock: 46, featured: true,
    shortDescription: "An overnight lip mask that leaves lips soft and smooth by morning.",
    description:
      "A thick, balm-like mask applied before bed that works overnight to soften dry, flaky lips. Berry extracts and vitamin C give it a light fruity scent, while murumuru and shea butters provide lasting moisture. Many people also use a thin layer during the day as a glossy lip treatment. The included applicator keeps the jar clean.",
    howToUse: "Apply a generous layer to lips before sleeping. Gently wipe off in the morning.",
    keyIngredients: ["Berry Fruit Complex", "Murumuru Seed Butter", "Shea Butter"],
    skinTypes: ["dry", "normal", "oily", "combination", "sensitive"], concerns: ["dehydration"],
  },
  {
    title: "Mediheal Tea Tree Care Solution Essential Mask (10 Pack)",
    brand: "Mediheal", category: "masks", size: "10 x 24ml", price: 1250, compareAtPrice: 1500, stock: 53,
    shortDescription: "Soothing tea tree sheet masks for oily, breakout-prone skin.",
    description:
      "Each sheet is soaked in an essence with tea tree leaf extract and centella to calm the look of breakouts and refresh oily skin. The thin cotton sheet fits closely, so the essence stays in contact with skin for the full 15 to 20 minutes. A pack of ten makes it easy to build a twice-weekly mask habit, and the masks feel especially good chilled on a hot day.",
    howToUse: "After cleansing and toning, apply the sheet for 15 to 20 minutes. Remove and pat the remaining essence into the skin.",
    keyIngredients: ["Tea Tree Leaf Extract", "Centella Asiatica", "Allantoin"],
    skinTypes: ["oily", "combination", "sensitive"], concerns: ["acne", "redness"],
  },
  {
    title: "COSRX Acne Pimple Master Patch (24 Patches)",
    brand: "COSRX", category: "masks", size: "24 patches", price: 450, compareAtPrice: 550, stock: 120,
    shortDescription: "Hydrocolloid patches that protect a breakout and help it heal undisturbed.",
    description:
      "Hydrocolloid patches cover an active pimple, absorb fluid and protect it from fingers, dirt and pillow friction. These thin, near-transparent patches come in three sizes and stay on overnight. They are a simple, effective way to stop picking and to help a spot look flatter by morning. Best on spots that have come to a head.",
    howToUse: "Apply to a clean, dry spot and leave on for at least 6 hours or overnight. Replace when the patch turns white.",
    keyIngredients: ["Hydrocolloid"],
    skinTypes: ["oily", "combination", "normal", "sensitive", "dry"], concerns: ["acne"],
  },
];
