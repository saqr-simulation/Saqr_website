# SAQR brand update

## Reference interpretation

The user's request is to update fonts, colors and logos throughout the existing site. `charte graphique.pdf` supplies the visual identity; `SAQR_DESIGN_SYSTEM_v2.md` supplies the detailed UI rules. Their simulator descriptions and future feature guidance do not expand this styling task or change the implemented product features.

The references agree on navy `#1F2D50`, primary blue `#154D8E`, soft blue `#4688C5`, light blue `#BFE3F0`, Jumbox display type and Montserrat UI text. Where the PDF's RGB labels disagree with its hex labels, the explicit hex palette repeated in v2 is used. The v2 agriculture accents extend that core palette.

## Applied across both applications

- Pearl-white page backgrounds and white cards, navy navigation/hero/footer/sidebar, blue main actions.
- Agriculture green for course badges, field illustrations and progress, with pale green agriculture sections.
- Uppercase Jumbox for larger display headings. Small dashboard headings, forms, navigation, body text and metrics use Montserrat.
- Locally bundled WOFF2 fonts. Jumbox is reconstructed from the supplied PDF subset, not a substitute typeface; unsupported punctuation uses the fallback font.
- The original falcon vector silhouette replaces the temporary triangle. The attached green logo treatment is kept as a dedicated logo color, separate from agriculture UI green. Both apps use the falcon favicon.
- Shared input, button, badge, modal, dropdown, error, focus and disabled colors follow semantic tokens.
- Light mode remains the default. Intentional navy sections use `.dark-surface`; automatic system dark mode is not added.

## Files

- `packages/ui/src/tokens.css`: colors, fonts, spacing and section-level tokens.
- `packages/ui/src/layout.css`: base component structure and responsive layout.
- `packages/ui/src/brand.css`: brand typography and component treatment.
- `packages/ui/src/styles.css`: explicit token → base → brand cascade.
- `packages/ui/src/brand-mark.tsx`: extracted vector mark.
- `packages/ui/src/fonts/`: self-hosted assets and provenance.
- `apps/*/public/saqr-mark.svg`: favicon for each independently deployed app.

## Contrast verification

Ratios were recalculated from sRGB relative luminance rather than copied from the reference matrix. Normal text needs 4.5:1; focus indicators need 3:1. These representative pairs pass:

| Pair                                       | Measured ratio |
| ------------------------------------------ | -------------: |
| Navy / pearl                               |        12.11:1 |
| Secondary text / pearl                     |         6.18:1 |
| Pearl / primary-blue button                |         7.56:1 |
| Pearl / hover-blue button                  |         6.04:1 |
| Dark-section metadata / navy               |         9.83:1 |
| Agriculture-dark / agriculture-light badge |         7.38:1 |
| Data-blue / light-blue notice              |         9.21:1 |
| Error text / error surface                 |         7.09:1 |
| Warning text / warning surface             |         6.95:1 |
| Soft-blue focus / pearl                    |         3.36:1 |
| Soft-blue focus / navy                     |         3.61:1 |

Two listed reference combinations do not meet normal-text AA when recalculated: soft blue on navy is 3.61:1 and pearl on amber is 3.56:1. The implementation therefore uses light neutral metadata on navy and dark amber text on a pale warning surface. Light blue is used for surfaces, not body text. Logo colors are not used as body text.

## Validation

Production builds, lint, strict type checks and HTTP route smoke checks passed after the update. The font binaries were parsed, all uppercase Jumbox letters and digits were confirmed, and the extracted falcon was rendered for comparison with the supplied logo.

The browser runtime reported no connected browser. Visual desktop/mobile review and real browser font rendering remain unverified; the checks above are not a claim of complete WCAG conformance.
