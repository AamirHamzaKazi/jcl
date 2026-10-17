# Campa website concept: design and component sources

This is a Campa brand website concept created for Jio Creativity Labs. The Campa name, logo and product packaging belong to their respective owners. Campaign photography is original AI-generated creative work for the concept; it is not an official Campa advertising campaign or documentary photography.

## Brand and visual direction

- [Campa's brand website](https://campabeverages.com/) — brand identity, original product presentation, and Cola, Orange and Lemon flavour references.
- [Awwwards](https://www.awwwards.com/) — creative direction reference for oversized editorial typography, expressive product staging, movement, and immersive landing pages. The implementation is an original layout, with no Awwwards template copied into the project.
- [UI8](https://ui8.net/) — visual reference for premium product composition, rich colour palettes, and polished interfaces. No paid UI8 kit or downloaded UI8 asset is included.

The Jio Creativity Labs direction is an expressive, image-led brand experience: cinematic liquid and ice, candid Indian youth culture, oversized condensed and italic editorial typography, cream and deep plum contrasts, and lime accents. Full-bleed campaign sections, scroll-linked parallax, magnetic controls, staggered reveals, expanding flavour panels and an interactive photograph gallery carry the creative direction through the page. Motion respects the visitor's reduced-motion preference.

## Original campaign assets

All four images were generated with the built-in image generation tool using existing Campa product assets as packaging references. Each final WebP is stored inside the project and optimized for website use; a PNG source is retained alongside it.

| Final asset | Dimensions | Art direction | Generation record |
| --- | --- | --- | --- |
| `public/images/campaign-hero.webp` | 1672 × 941 | Cinematic purple Campa Cola can with frozen cola splashes, condensation and ice; full-bleed product hero. | Built-in image generation; Campa can packaging reference. |
| `public/images/campaign-rooftop.webp` | 1536 × 1024 | Indian friends sharing Campa bottles on a Mumbai rooftop at orange and violet golden hour; candid fashion editorial styling. | [`prompts-rooftop.md`](./prompts-rooftop.md) |
| `public/images/campaign-skate.webp` | 1254 × 1254 | Indian woman skateboarder with a purple Campa can, sunlit concrete, lavender mural and orange streetwear accent. | [`prompts-skate.md`](./prompts-skate.md) |
| `public/images/campaign-citrus.webp` | 1536 × 1024 | Two flavour worlds: Campa Orange with orange slices and soda; Campa Lemon with citrus, ice and sparkling water. | [`prompts-citrus.md`](./prompts-citrus.md) |

Existing Campa logo and isolated product artwork remain available in `public/images/`, including the raised-bottles composition used in the closing brand scene. The page does not depend on remote image hosts.

## Integrated component libraries

These are actual local source integrations adapted to the project's plain CSS styling, rather than references to a library only by name. The component styles are in `src/components/effects.css` and are imported by the root layout. Registry endpoints are also recorded in `components.json`.

| Library | Local source | Integration on this page | Official source |
| --- | --- | --- | --- |
| shadcn/ui | `src/components/ui/button.tsx` | Circular closing call to action and store-finder submit button; Radix Slot supports link composition and class-variance-authority manages variants. | [Button source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/button.tsx) |
| Magic UI | `src/components/magicui/marquee.tsx` | Oversized “MADE OF INDIA. MADE FOR NOW.” ticker after the flavour worlds, with hover pause and reduced-motion support. | [Marquee registry](https://magicui.design/r/marquee.json) |
| Aceternity UI | `src/components/aceternity/spotlight.tsx` | Atmospheric lighting in the “GOOD. Together.” section, using the official SVG effect and a unique filter ID. | [Spotlight registry](https://ui.aceternity.com/registry/spotlight.json), [documentation](https://ui.aceternity.com/components/spotlight) |
| React Bits | `src/components/reactbits/blur-text.tsx` | The closing heading's animated “More sipping.” text, using Motion for React with accessible static screen-reader text. | [BlurText source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/BlurText/BlurText.tsx) |

The installed supporting packages are `motion`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, and `tailwind-merge`. Icons use `lucide-react`.

Component copyright and license notices are preserved in [`src/components/LICENSES.md`](../src/components/LICENSES.md). React Bits' license permits use as part of a website and restricts separate resale or redistribution of its components.

## Interaction scope

## Then → Now and both packaging formats

The brand story is now a three-stage experience: **1977 — The Beginning**, **2023 — The Return**, and **Now — A Legacy, Reimagined.** On larger screens the section stays in view while the warm, grainy origin artwork fades into cinematic purple and the modern bottle rises into view. Chapter buttons also navigate the story. Mobile visitors and visitors requesting reduced motion get three sequential panels.

The origin illustration is explicitly described as a vintage-inspired tribute. It is not presented as an archival photograph. The website's brand line is attributed as **Campa / “A 50+ Years Legacy”** rather than derived from a date calculation.

Historical references: [Campa's official website](https://campabeverages.com/), [Reliance FY2022–23 report: acquisitions](https://www.ril.com/ar2022-23/retail.html), [Reliance FY2022–23 report: Campa launch](https://www.ril.com/ar2022-23/financial-performance-and-review.html), [9 March 2023 launch report](https://www.fortuneindia.com/amp/story/macro/reliance-launches-iconic-beverage-brand-campa-in-new-avatar/111861), and [2022 acquisition report](https://www.business-standard.com/article/companies/campa-set-to-return-to-indian-market-after-acquisition-by-reliance-retail-122083100241_1.html).

All three flavour panels now show both a can and a bottle. Photography is fitted to preserve both complete packages without typography covering the labels. The hero and modern history scene also use the Cola pair.

| Final asset | Use | Prompt record |
| --- | --- | --- |
| `public/images/campaign-cola-duo.webp` | Wide Cola can-and-bottle hero and modern story | [Cola duo](./prompts-cola-duo.md) |
| `public/images/flavour-cola-duo.webp` | Portrait Cola pair and responsive hero/history | [Cola duo crop](./prompts-cola-duo.md) |
| `public/images/flavour-orange-duo.webp` | Orange can and bottle | [Orange duo](./prompts-orange-duo.md) |
| `public/images/flavour-lemon-duo.webp` | Lemon can and bottle | [Lemon duo](./prompts-lemon-duo.md) |

These images were generated with the built-in image-generation tool from the official product cutouts. PNG sources are retained and the website consumes optimized local WebP files.

## Additional interactions

The flavour worlds expand on pointer hover, keyboard focus or selector activation, with all three presented as full-width cards on mobile. Campaign tiles open a native modal photograph gallery with previous, next and close controls. The mobile navigation opens its menu. The store finder validates an Indian PIN code and offers Google Maps and JioMart links; it does not claim to query live store inventory or complete a purchase.
