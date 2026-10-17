# Campa motion direction and performance pass

The motion follows one editorial easing curve (`.22, 1, .36, 1`), restrained distances, staggered arrivals and calm image movement. The goal is continuity between chapters and responsive controls rather than competing effects.

## Implemented

- Desktop wheel scrolling uses Lenis 1.3.27 with a single automatic animation loop. Native touch inertia is preserved; compact/coarse-pointer devices do not initialize Lenis. Reduced-motion preferences are respected.
- Scroll values are lightly damped before driving the hero, culture detail and bottle montage. Mobile parallax ranges are small and headline copy stays readable rather than disappearing on scroll.
- The navigation keeps the same position and dimensions while its background changes. It no longer changes from absolute to fixed or shrinks while scrolling.
- Flavour panels keep stable dimensions. Product images, captions and accent lines move using transforms and opacity, avoiding per-frame flex layout changes. Touch users see stacked panels with every call to action exposed.
- Magnetic controls measure their stationary wrapper once on pointer entry, clamp displacement and run only with a fine pointer.
- History chapter text fades separately from the image crossfade. Inactive layers are hidden, state changes only at chapter boundaries and desktop chapter navigation shares the smooth-scroll controller.
- Mobile history panels fit their content and reserve product-art space. Their short entrance reveals play once. Reduced-motion panels stay visible without animated scrolling.
- Expensive animated text blur, large SVG Gaussian blur, resampled image blur and hover saturation were removed. Atmospheric light uses a static radial gradient.
- The marquee uses composited transforms and pauses when outside the viewport, while the document is hidden, or when reduced motion is requested.
- Dialog transitions share a short non-bouncy ease; body scroll locking preserves page width and keyboard focus. The gallery crossfades photographs without changing the media frame dimensions.
- Mobile controls meet a 44px target minimum where applicable. The tablet/touch navigation and flavour layout no longer rely on hover.

## Preview and verification

The optimized production server is the intended review environment; the development server adds compilation and development tooling overhead. Production compilation and TypeScript checks pass. HTTP checks verify that the page and local assets are served.

Device frame rates and subjective motion quality have not been measured with a browser performance trace. Physical-device review remains the final check for perceptual smoothness; no guaranteed FPS claim is made.

Implementation references: [Lenis official documentation](https://github.com/darkroomengineering/lenis), [Motion performance guide](https://motion.dev/docs/performance), [Motion scroll values](https://motion.dev/docs/react-use-scroll).
