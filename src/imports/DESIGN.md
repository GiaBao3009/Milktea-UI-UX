# Design System Strategy: The Serene Infusion

## 1. Overview & Creative North Star
**Creative North Star: "The Botanical Boutique"**
This design system moves away from the cluttered, neon-soaked aesthetic of traditional bubble tea shops. Instead, it adopts a "High-End Editorial" approach. We treat every interface like a premium lifestyle magazine—airy, intentional, and tactile. 

The system achieves a premium feel by breaking the traditional rigid grid. We embrace **intentional asymmetry**, where product imagery may bleed off-screen or overlap container boundaries. By utilizing generous whitespace and a sophisticated tonal palette, we create a digital environment that feels as calming as the first sip of a premium matcha.

---

## 2. Colors & Surface Philosophy
The palette is rooted in botanical greens and creamy neutrals, designed to evoke freshness and organic quality.

*   **Primary (#3d6751) & Primary Container (#A8D5BA):** Our "Matcha" signature. Use the deep primary for high-contrast text and the lighter container for soft background blocks.
*   **Surface Hierarchy & Nesting:** We define space through **Tonal Layering**.
    *   **Level 0 (Base):** `surface` (#f9f9f9).
    *   **Level 1 (Sections):** `surface_container_low` (#f3f3f3) to define large content areas.
    *   **Level 2 (Interactive):** `surface_container_lowest` (#ffffff) for cards and floating elements.
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined solely through background color shifts. If a card sits on a `surface`, it should be `surface_container_lowest`.
*   **The "Glass & Gradient" Rule:** For hero sections and primary CTAs, use subtle linear gradients transitioning from `primary` to `primary_fixed_dim`. For floating navigation bars, use `surface_container_lowest` with a 70% opacity and a `20px` backdrop-blur to create a "frosted glass" effect.

---

## 3. Typography: Editorial Authority
We utilize **Plus Jakarta Sans** for its modern, friendly, yet professional geometric structure.

*   **Display (lg/md):** Reserved for lifestyle headlines. Use `display-lg` (3.5rem) with `-0.02em` letter-spacing to create a high-fashion, "editorial" impact.
*   **Title (lg/md):** Used for product names (e.g., "Ceremonial Matcha Latte"). These should feel authoritative and clear.
*   **Label (md/sm):** Use for nutritional info or categories. Increase letter-spacing to `0.05em` and use uppercase sparingly to create a sense of curated "meta-data."
*   **Hierarchy Note:** Always pair a large `display-md` headline with a `body-md` description. The extreme contrast in scale is what separates this system from a standard template.

---

## 4. Elevation & Depth
Depth in this system is organic, not artificial. We mimic natural light hitting soft surfaces.

*   **The Layering Principle:** Stack surfaces to create focus. An "Add to Cart" sheet should use `surface_container_high` sitting atop a dimmed `surface_dim` backdrop. 
*   **Ambient Shadows:** When a "floating" lift is required (e.g., a hovered product card), use a shadow with a `32px` blur and `4%` opacity using the `on_surface` color. It should feel like a soft glow, not a dark edge.
*   **The "Ghost Border" Fallback:** If accessibility requires a container definition (like an input field), use the `outline_variant` token at **15% opacity**. This "Ghost Border" provides a hint of structure without breaking the minimal aesthetic.
*   **Roundedness:** We use a generous scale. Standard cards use `lg` (2rem/32px), while buttons and chips use `full` (9999px) to mimic the shape of boba pearls.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background with `on_primary` text. Shape: `full`. No border. Transition: `200ms ease-out` on scale (1.02x on hover).
*   **Secondary:** `secondary_container` background. Provides a softer, lower-priority action that blends with the "milk tea" aesthetic.

### Cards & Lists
*   **The "No-Divider" Rule:** Explicitly forbid horizontal divider lines. Separate list items using `1.5rem` (md) vertical whitespace or by alternating between `surface` and `surface_container_low` backgrounds.
*   **Product Cards:** Use `xl` (3rem) radius for top corners and `lg` (2rem) for bottom corners to create a custom, "dipped" look.

### Input Fields & Controls
*   **Text Inputs:** Use `surface_container_highest` backgrounds with a "Ghost Border." Focus state: Transition background to `white` and increase shadow slightly.
*   **Selection Chips:** Use `secondary_fixed` for unselected and `primary_container` for selected. These should feel tactile—like physical buttons on a high-end appliance.

### Custom Component: The "Steeping" Progress Bar
*   For order tracking, use a thick (`8px`) track with `primary_fixed` color and a `primary` indicator. The ends must be `full` rounded.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use overlapping imagery. A bubble tea cup should physically overlap the edge of its container card to create depth.
*   **Do** use "Plus Jakarta Sans" with tight tracking for large headlines to maintain a premium feel.
*   **Do** rely on the `lg` (2rem) and `xl` (3rem) corner radii to maintain the "soft and friendly" brand promise.

### Don't:
*   **Don't** use 100% black (#000000). Always use `on_surface` (#1A1C1C) for text to keep the contrast "soft."
*   **Don't** use standard Material Design drop shadows. If it looks like a "default" shadow, it is too heavy.
*   **Don't** crowd the interface. If a screen feels "busy," increase the padding using the `3rem` (xl) spacing token. Generous margins are the hallmark of luxury.

### Accessibility Note:
While we emphasize softness, ensure that `on_surface` text against `surface` backgrounds maintains a minimum 4.5:1 contrast ratio. Use `primary` (#3d6751) for essential action text to ensure visibility.