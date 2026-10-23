import { blogCovers } from "./images.js";

/**
 * Journal articles. Body format: blank line = new block, "## " = heading,
 * "- " = bullet, "1. " = numbered item, **bold** inline. Rendered as React, never as raw HTML.
 */
export const posts = [
  {
    title: "The K-beauty routine, in the right order",
    slug: "korean-skincare-routine-order",
    cover: blogCovers.routine,
    tags: ["Basics", "Routine"],
    readMinutes: 5,
    daysAgo: 4,
    excerpt: "Ten steps is a myth. Here is the order that matters, which steps you can skip, and why thin-to-thick is the only rule worth remembering.",
    content: `The famous ten-step Korean routine was always more marketing than method. What actually matters is the order you apply things in, because that decides whether each product can do its job.

## The one rule: thin to thick

Apply products from the most watery to the heaviest. A watery toner cannot get through a layer of cream, but a cream sits happily on top of a toner. If you remember nothing else, remember this.

## A routine that covers almost everyone

1. **Cleanser.** A gentle, low-pH gel or foam. At night, start with an oil or balm if you wore sunscreen or makeup.
2. **Toner.** Optional. Useful if your skin feels tight after cleansing or you want a gentle exfoliating step.
3. **Serum.** One targeted treatment: niacinamide for oil and marks, hyaluronic acid for dehydration, centella for redness.
4. **Moisturizer.** Every skin type needs one, oily skin included. Pick a gel-cream if you dislike heavy textures.
5. **Sunscreen.** Mornings only, always last, two finger-lengths for face and neck.

## What you can safely skip

Essences, ampoules, sleeping packs and eye creams are nice extras, not requirements. If your budget is tight, spend it on a good sunscreen and a moisturizer you enjoy using. Consistency beats complexity every time.

## Give it time

Skin renews itself roughly every four weeks, so judge a new routine after a month, not after three days. Introduce one new product at a time so you know what is working and what is not.`,
  },
  {
    title: "Choosing a sunscreen for heat and humidity",
    slug: "sunscreen-for-humid-weather",
    cover: blogCovers.sunscreen,
    tags: ["Sunscreen", "Basics"],
    readMinutes: 4,
    daysAgo: 11,
    excerpt: "If your sunscreen feels greasy by noon, you will stop wearing it. How to read SPF and PA ratings and find a texture you will actually reapply.",
    content: `In a hot, humid city the best sunscreen is simply the one you are willing to wear every day and reapply. Protection numbers matter, but texture decides whether those numbers ever reach your skin.

## Reading the label

**SPF** measures protection from UVB, the rays that cause burning. SPF 50 is a sensible everyday choice in strong sun.

**PA** ratings measure protection from UVA, the rays behind tanning, dark spots and long-term ageing. Look for PA+++ or PA++++.

"Broad spectrum" on Western labels means the product covers both.

## Match the texture to your skin

- **Oily or combination:** watery gels and sun serums that set to a natural or soft-matte finish.
- **Dry or normal:** creamier formulas with hyaluronic acid or ceramides that double as a light moisturizer.
- **Sensitive:** fragrance-free formulas; some people do better with mineral filters, others with modern organic filters. Patch test first.

## How much is enough

Most people apply half the amount they need. For face and neck, use about two finger-lengths. Apply it as the last step of your morning routine and give it a minute to set before makeup.

## Reapplication is the real secret

Sunscreen breaks down with sweat, oil and time. Reapply every two to three hours when you are outdoors. A sun stick or cushion over makeup is better than not reapplying at all.`,
  },
  {
    title: "Double cleansing: who needs it and how to do it",
    slug: "double-cleansing-guide",
    cover: blogCovers.doubleCleanse,
    tags: ["Cleansing", "Routine"],
    readMinutes: 4,
    daysAgo: 19,
    excerpt: "An oil cleanser followed by a water-based one is the most reliable way to remove sunscreen. Here is when it is worth the extra minute.",
    content: `Double cleansing means washing your face twice at night: first with an oil-based cleanser, then with a water-based one. It sounds excessive, but it solves a real problem.

## Why one cleanser is not always enough

Modern sunscreens and long-wear makeup are designed to resist water and sweat. A regular foam cleanser struggles to lift them, which leaves a film that can clog pores and stop your serum from absorbing well. Oil dissolves oil, so an oil or balm breaks those products down quickly and gently.

## How to do it

1. With dry hands on a dry face, massage a cleansing oil or balm for about a minute.
2. Add a little water. The oil turns milky. Rinse thoroughly.
3. Follow with a gentle gel or foam cleanser to remove any leftover residue and sweat.
4. Pat dry and continue with the rest of your routine.

## Who can skip it

If you did not wear sunscreen or makeup that day, a single gentle cleanse is enough. In the morning, a splash of water or a mild cleanser is all most skin needs.

## Common mistakes

Do not use hot water, and do not scrub. If your skin feels tight or squeaky after cleansing, your second cleanser is too harsh. Look for one with a low pH.`,
  },
  {
    title: "Niacinamide, explained without the hype",
    slug: "niacinamide-explained",
    cover: blogCovers.niacinamide,
    tags: ["Ingredients", "Dark spots"],
    readMinutes: 5,
    daysAgo: 27,
    excerpt: "What niacinamide can and cannot do for oil, pores and dark marks, which percentage to start with, and what to pair it with.",
    content: `Niacinamide is a form of vitamin B3 and one of the best-researched ingredients in skincare. It is gentle, works for most skin types and pairs well with almost everything. It is also not magic.

## What it does well

- **Evens out tone.** It reduces the transfer of pigment to the surface of the skin, which helps post-acne marks and uneven patches fade over several weeks.
- **Balances oil.** Many people notice less midday shine after a month of use.
- **Supports the barrier.** It helps skin produce ceramides, which keeps moisture in.

## What it will not do

It will not shrink pores permanently, erase deep scarring or replace sunscreen. Dark spots fade only if you also protect them from the sun every day.

## Which percentage?

Studies show benefits at 2% to 5%. Higher concentrations such as 10% are popular, but they are not necessarily better and can cause redness or tingling in sensitive skin. If you are new to it, start with a lower strength.

## How to use it

Apply a niacinamide serum after toner and before moisturizer, morning, evening or both. It combines well with hyaluronic acid, centella, retinoids and sunscreen. The old advice to never mix it with vitamin C is outdated for modern formulas.

## Be patient

Give it eight to twelve weeks before deciding whether it works for you.`,
  },
  {
    title: "How to patch test a new product",
    slug: "how-to-patch-test",
    cover: blogCovers.patchTest,
    tags: ["Basics", "Sensitive skin"],
    readMinutes: 3,
    daysAgo: 36,
    excerpt: "Five days now can save you five weeks of irritated skin later. A simple method that works for serums, creams and sunscreens.",
    content: `A patch test is a small trial that tells you whether your skin tolerates a product before you put it all over your face. It takes a few days and is worth it, especially with active ingredients.

## The method

1. Choose a small area that reacts like your face but is easy to hide, such as the side of the neck or just below the jawline.
2. Apply a small amount of the product once a day, the way you normally would.
3. Repeat for five to seven days.
4. If there is no redness, itching, burning or bumps, start using it on your face, a few times a week at first.

## What a reaction looks like

Itching, stinging that does not fade after a minute, raised bumps or a rash are signs to stop. Mild tingling from an exfoliating acid that disappears quickly is usually normal.

## One product at a time

If you start three new products together and your skin reacts, you will not know which one caused it. Introduce one new product every two weeks.

## When to see a doctor

If a reaction is severe, spreads, or does not settle within a couple of days after stopping the product, see a dermatologist.`,
  },
  {
    title: "Spotting counterfeit Korean skincare",
    slug: "spot-fake-korean-skincare",
    cover: blogCovers.fakes,
    tags: ["Shopping", "Basics"],
    readMinutes: 4,
    daysAgo: 45,
    excerpt: "Fake bottles are common and can contain anything. Practical checks for packaging, price and seller before you buy.",
    content: `Popular Korean skincare is widely copied, and counterfeit products can contain unknown ingredients, bacteria or the wrong concentration of actives. A few simple checks reduce the risk a lot.

## Check the price

If a product is selling for far below what established shops charge, be cautious. Genuine stock has a real cost, and a price that seems too good is often exactly that.

## Look closely at the packaging

- Printing should be sharp, with no blurry text or spelling mistakes.
- Check for a batch number and expiry or manufacture date, usually printed or embossed on the tube or box.
- Compare the box and bottle with photos on the brand's official website.
- Seals should be intact, and the product inside should match the expected colour, smell and texture.

## Check the barcode

Korean products usually start with **880**. A barcode alone does not prove authenticity, but a missing or mismatched one is a warning sign.

## Buy from sellers who can answer questions

A trustworthy shop can tell you where its stock comes from and will accept returns on a sealed product that turns out to be wrong. Read recent reviews, not just the overall rating.

## If in doubt, do not use it

If something about a product seems off once it arrives, it is safer not to put it on your face.`,
  },
];
