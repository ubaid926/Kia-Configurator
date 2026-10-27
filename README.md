# Concept 05 — Architectural Minimal Luxury UI

A drop-in visual redesign of the existing Elipse Studio Kia Sportage / PlayCanvas configurator.

## Included
- `index.html` — original HTML with two added stylesheet/script links
- `CSS/style.css` — original CSS, unchanged
- `CSS/concept05.css` — luxury visual theme, transitions, responsive layout
- `JS/script.js` — original JavaScript / PlayCanvas messaging, unchanged
- `JS/concept05.js` — UI-only enhancements and accessible control labels

## Integration
1. Back up the existing website.
2. Copy the included files into the website root, keeping the `CSS` and `JS` directories.
3. **Keep your existing `IMAGES/` and `Sound/` folders on your website.** They're referenced by the original code but were not supplied in this chat.
4. Serve via your existing web host or local HTTP server rather than directly opening `index.html` as `file://`.
5. Clear cached CSS/JS and test the app.

## Preserved
Original PlayCanvas iframe URL, element IDs, selection events, `postMessage` bridge, colors, environment switching, lights, indicators, doors, camera, seat options, all feature modal popups, exit and fullscreen.

## Note
The original JavaScript refers to audio elements and a few functions which are not defined in the supplied files (`DoorOpenSound`, `DoorCloseSound`, `IndicatorsSound`, `deactivatesfButton`). The redesign intentionally doesn't rewrite the underlying app's behavior. If those external assets/functions are missing on deployment, those particular legacy actions should be repaired separately. The live 3D engine is hosted externally, so actual app rendering and camera integration could not be end-to-end tested in this package.
