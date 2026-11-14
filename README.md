# Chromia

A color palette generator for designers and developers. Describe your project, pick a mood, or spin the color wheel, and Chromia builds the palette, checks it for accessibility, and gives you the code.

**Live demo:** [GitHub Pages](https://vinuta02.github.io/chromia/) | [Vercel](https://chromia.vercel.app)

## Features

- Describe a project (for example "calm meditation app") and get a matching palette
- Lock colors, generate with the spacebar, and save palettes to localStorage
- Harmony modes: random, analogous, complementary, triadic, monochrome
- Color codes in HEX, RGB, HSL, and HSB
- Soft, pastel, vibrant, deep, and muted presets, plus saturation and lightness sliders
- Mood palettes with short stories
- Interactive color wheel
- Nine-step tints and shades for every color
- Linear, mesh, and conic gradients with copyable CSS
- Color blindness simulation (protanopia, deuteranopia, tritanopia, achromatopsia)
- WCAG contrast checker for any text and background pair

## Run locally

Download or clone the repo and open `index.html` in a browser. No build step or dependencies.

## Built with

HTML, CSS, and vanilla JavaScript.

## Design decisions

- **HSL for generation:** it makes saturation and lightness easy to control, so palettes stay harmonious.
- **WCAG contrast:** ratios use the relative luminance formula, with AA at 4.5:1 and AAA at 7:1 for normal text.
- **Color blindness simulation:** uses the Machado et al. (2009) matrices on linear RGB values.
- **Prompt feature:** matches keywords to color themes in the browser, so it needs no API key.
- **Outlined lock icon:** it keeps the interface light so the palette is the focus.
