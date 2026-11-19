# Chromia

A color palette generator and design system builder for designers and developers. Describe your project, pick a mood, or spin the color wheel. Chromia builds the palette, turns it into light and dark themes, checks it for accessibility, and gives you the code.

**Live demo:** [GitHub Pages](https://vinuta02.github.io/chromia/) | [Vercel](chromia-ten.vercel.app)

## Features

**Palette generator**
- Describe a project (for example "cozy coffee shop") and get a matching palette
- Lock colors, generate with the spacebar, and save palettes to localStorage
- Harmony modes: random, analogous, complementary, triadic, monochrome
- Color codes in HEX, RGB, HSL, and HSB
- Soft, pastel, vibrant, deep, and muted presets, plus saturation and lightness sliders
- Mood palettes with short stories
- Interactive color wheel and nine-step tints and shades for every color
- Linear, mesh, and conic gradients with copyable CSS

**Design system**
- Turns the palette into 12 named roles (primary, surface, text, success, danger, and more) for light and dark themes
- Auto-fix for WCAG AA contrast
- Export as CSS variables, Tailwind config, or JSON tokens
- Color blindness check for success, warning, and danger colors

**Live previews**
- See the palette on a landing page, a dashboard, and a mobile app in light and dark themes
- Previews adapt to the project type: coffee shop, wedding invite, fitness brand, fintech, travel blog, and meditation app

**Accessibility**
- Color blindness simulation (protanopia, deuteranopia, tritanopia, achromatopsia)
- WCAG contrast checker for any text and background pair
- Keyboard accessible, with visible focus styles and respect for reduced motion

## Run locally

Download or clone the repo and open `index.html` in a browser. No build step or dependencies.

## Built with

HTML, CSS, and vanilla JavaScript.

## Design decisions

- **HSL for generation:** it makes saturation and lightness easy to control, so palettes stay harmonious.
- **WCAG contrast:** ratios use the relative luminance formula, with AA at 4.5:1 and AAA at 7:1 for normal text.
- **Auto-fix:** lightness is adjusted step by step until each text and background pair reaches the target ratio.
- **Color blindness simulation:** uses the Machado et al. (2009) matrices on linear RGB values.
- **Prompt feature:** matches keywords to color themes and project types in the browser, so it needs no API key.
- **Outlined lock icon:** it keeps the interface light so the palette is the focus.
