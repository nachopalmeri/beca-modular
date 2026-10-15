# Beca Modular visual redesign

## Goal
Rework the existing landing page around the cinematic academic storytelling with the autumnal colorimetry of *Dead Poets Society*, retaining the full-page editorial rhythm inspired by [Ato Launch](https://heyato.ai/es/launch), while keeping Beca Modular's Spanish copy, simulations, evidence, OpenArg map, and current behaviors intact.

## Brief and decisions
- Audience: scholarship sponsors, education institutions, and learners evaluating a concept-stage modular scholarship.
- Main action: explore the milestone scholarship demo; secondary actions open the supporting product and evidence sections.
- Preserve brand truth: concept in validation; no real payments, verified outcomes, or production chain integration.
- Borrow the full-bleed hero, floating capsule navigation, confident oversized headline and editorial page rhythm. Use *Dead Poets Society* colorimetry: forest green, oxblood, walnut, parchment and candlelight gold.
- Reject copying Ato's logo, exact copy, product imagery, testimonials, or purchase flow. Use Beca-specific imagery and existing content.
- Signature: five scholarship tranches represented as a visible progression from sponsor to learner, echoing a study journey.
- Visual system: parchment surfaces, deep forest and burgundy accents, restrained candlelight-gold details and an oxblood CTA, editorial serif display face, legible sans body, and mono labels for data/technical details.
- Keep all existing controls, data tables, map embed, disclaimers, and anchor destinations accessible and responsive.

## References and structure
- Ato launch page: photographic hero, floating navigation and narrative page rhythm.
- Current Beca Modular landing: preserve its product content and interactive sections.
- OpenArg map panel: retain as a functional data visualization within the education-context section.
- Selected wireframe: pill navigation over a full-bleed hero with copy anchored bottom-left; a narrow proof strip; alternating editorial sections; warm inset canvases for the existing demos; data and finance areas remain dense but clearly separated; finish with the current evidence and next-step CTA.

## Paths and order
1. Add an original wide study-scene hero image under `assets/` and reference it in `dist/` output.
2. Update `index.html` to apply the new visual hierarchy without removing content or handlers.
3. Rebuild `styles.css` with responsive warm editorial styling; preserve reduced-motion, focus, and table-overflow behaviors.
4. Sync static assets to `dist/`, visually inspect desktop and mobile, fix defects, and check `git diff --check`.
5. Use the existing Sites source/publish workflow and preserve the public audience.

## Acceptance criteria
- The top viewport reads like a polished, cinematic launch page inspired by Ato, with Beca-specific content and branding.
- Existing scholarship, finance, MPP, role, learning-route and disclosure interactions remain present.
- The OpenArg educational map remains usable, with external alternatives available.
- Layout works at 390x844, 768x1024 and 1440x900; visible keyboard focus and readable contrast remain.
- Static archive includes the updated `index.html`, CSS, JS and image asset.

## Verification and stopping conditions
- Do not add or run product tests unless requested. Run the local preview and inspect the three target viewports, then `git diff --check` and ensure the packaged output matches the committed Site source.
- Stop if content loss, an inaccessible external map, broken local build, or unapproved expansion of the public site's audience is found; preserve current audience and fix within scope where possible.

