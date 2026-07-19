# Project repair summary

This version preserves the original Home, Store, and Lab designs.

## Fixed
- Restored all missing homepage imports through lightweight grouping components.
- Fixed the Next Image multiline `sizes` runtime selector error.
- Removed the duplicate homepage footer-video rendering.
- Removed the nested page-level `<main>` landmark.
- Fixed React 19 effect lint errors without changing animations.
- Added non-visual responsive and touch-scrolling safeguards.
- Verified lint has no errors.
- Verified the Next.js 16 production build succeeds.

## Product data
Existing product sections continue to read from `public/data.json` and retain their original card designs.
