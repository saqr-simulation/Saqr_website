# SAQR font assets

- `jumbox-brand.woff2`: Jumbox Regular subset embedded in the supplied `charte graphique.pdf`, converted from its CFF outlines to a browser-loadable WOFF2. Covers A–Z, 0–9 and the additional glyphs present in that reference. Display styling uses uppercase. Characters outside the supplied subset fall back to Montserrat.
- `montserrat-variable.woff2`: Montserrat variable font from the Google Fonts repository, self-hosted under its included SIL Open Font License (`Montserrat-OFL.txt`). Supports the UI weights without separate downloads.

The fonts load locally through the shared CSS in both Next.js applications. There is no runtime Google Fonts dependency. The original PDF is unchanged.

To regenerate the checked-in assets from the reference:

```sh
uv run --with pymupdf --with fonttools --with brotli python scripts/extract-brand-assets.py
```

The extraction script also reconstructs the PDF's top falcon silhouette as an SVG path. Its green presentation follows the logo images supplied with the branding request; it is separate from the agriculture UI green.
