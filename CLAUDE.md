# CLAUDE.md — Template 4 Design System

## 1. Project Goal

Build a polished, production-quality SaaS landing-page template using **Next.js, React, TypeScript, and Tailwind CSS**.

This is Template #4 in a collection. It must have its own recognizable visual identity and must not look like a recolored copy of the previous templates.

### Visual identity

- **Direction:** Premium dark, modern, slightly futuristic.
- **Mood:** Confident, refined, focused, sophisticated.
- **Core palette:** Midnight black, elevated dark surfaces, electric violet, electric blue, soft white, muted gray.
- **Typography:** Sora for headings; Inter for body text and UI.
- **Visual signature:** Restrained violet/blue lighting, layered product visuals, crisp typography, and subtle depth.
- **Avoid:** noisy backgrounds and unnecessary animation.

The result should look like a credible, high-quality commercial SaaS template; not a generic AI-generated landing page.

## 2. Technology and Project Conventions

- Use the existing project setup and installed package versions.
- Use the **Next.js App Router** and follow the conventions already present in the repository.
- Use TypeScript and type component props properly.
- Use Tailwind CSS according to the version and configuration already installed.
- Use the existing component structure, aliases, and naming conventions.
- Use `next/font/google` for Sora and Inter if fonts are not already configured. Avoid loading the same font multiple times in separate components.
- Use the project's existing UI components where practical; use shadcn/ui when it fits the design.
- Use Motion (`motion/react`) only if it is already installed or can be added consistently with the project's setup. Do not silently introduce a new animation library.
- Prefer Server Components by default. Add `"use client"` only when browser APIs, state, event handlers, or client-side animation genuinely require it.
- Do not modify unrelated files, dependencies, configuration, or existing sections unnecessarily.
- Do not replace working project architecture just to implement one section.

## 3. Color Tokens

Use these colors consistently. Prefer centralized CSS variables/design tokens in the existing global stylesheet rather than repeating arbitrary color values throughout components.

| Token               | Value     | Purpose                                |
| ------------------- | --------- | -------------------------------------- |
| Midnight background | `#09090F` | Main page background                   |
| Elevated surface    | `#13131D` | Cards, panels, dropdowns               |
| Primary violet      | `#A78BFA` | Primary accent and selected highlights |
| Electric blue       | `#60A5FA` | Secondary accent                       |
| Soft white          | `#F4F4F5` | Main headings and high-emphasis text   |
| Muted gray          | `#A1A1AA` | Body text and supporting copy          |
| Subtle border       | `#272733` | Dividers and restrained outlines       |

### Color rules

- Keep the overall page dark, but create hierarchy with several subtle surface levels.
- Use soft white for headings and muted gray for secondary text.
- Use violet as the main accent and blue as a supporting accent.
- Gradients should be used whenever appropriate, such as a CTA, a highlighted phrase, a hero visual,...
- A subtle violet-to-blue gradient is acceptable.
- Keep borders low contrast. Borders should support layout, not dominate it.
- Maintain accessible text contrast. Do not use low-contrast gray text for important content.
- Treat the approximate **70% dark surfaces / 20% neutral typography and supporting UI / 10% accent colors** as a visual guideline, not a rigid formula.
- Do not introduce extra accent colors without a clear reason.

## 4. Typography

### Font families

- **Headings:** Sora
- **Body, labels, forms, and UI:** Inter

Use the existing font setup if it is already correct. Otherwise, configure the fonts once at the application layout level with `next/font/google` and expose reusable CSS variables.

### Suggested type scale

- Hero heading: `64–76px` on large desktop screens, responsive on smaller screens.
- Section heading: `40–48px` on desktop.
- Card heading: `20–24px`.
- Body text: `16–18px`.
- Labels and captions: `12–14px`.

### Typography rules

- Use bold, clear headings with a relatively tight line height.
- Keep paragraphs readable, with comfortable line height and a controlled maximum width.
- Use responsive sizing, such as Tailwind's responsive utilities or `clamp()` where appropriate.
- Avoid making every line bold, uppercase.
- Highlight only a short, meaningful part of a heading when it improves the design.
- Avoid oversized text that causes awkward wrapping on mobile.

## 5. Layout, Spacing, and Shape

- Main content width: approximately `1200–1280px`, consistent with the existing project container.
- Desktop section spacing: approximately `96–128px` vertically; adjust by section purpose.
- Use a consistent spacing scale and align section headings, content, and CTAs.
- Use a responsive 12-column approach where useful; do not force every section into the same layout.
- Card corner radius: approximately `14–18px`.
- Button corner radius: approximately `10–12px`.
- Use generous whitespace and clear visual hierarchy.
- Prefer intentional asymmetry and varied layouts over repeating the same centered heading plus three cards in every section.
- Ensure all layouts work on mobile, tablet, laptop, and wide desktop screens.
- Avoid horizontal overflow, clipped text, awkward empty spaces, and excessively narrow content.

## 6. Component Styling

### Buttons

- Primary buttons may use restrained violet-to-blue gradient or violet fill.
- Secondary buttons should use a transparent/dark fill with a subtle border.
- Use clear labels, visible keyboard focus, and appropriate disabled states.
- Add modest hover feedback, such as a small brightness/shadow change.
- Do not make every button glow unnecessarily.

### Cards and panels

- Use elevated dark surfaces with subtle borders when helpful.
- Create depth through surface contrast, spacing, and selective shadows; not through heavy effects on every card.
- Vary card layouts and visual content when appropriate.
- Avoid excessive rounded containers nested inside other rounded containers.

### Navigation

- Keep the Navbar clean and readable against the dark background.
- Ensure mobile navigation is genuinely functional, accessible, and easy to dismiss.
- Do not assume that a visible menu button is sufficient; implement and verify its open/close behavior.

### Forms and interactive elements

- Use consistent surfaces, borders, labels, focus states, and error states.
- Ensure controls are keyboard accessible and have meaningful accessible names.

## 7. Backgrounds and Visual Effects

Use effects to support the content, not to decorate every available space.

Preferred effects:

- A subtle radial violet or blue glow behind a key hero visual.
- A noise texture in selected areas only.
- Layered product previews, floating interface panels, or a carefully designed abstract visual.
- Soft shadows and gentle surface transitions.
- Fine background details that do not reduce text readability.

Avoid:

- Strong neon glows everywhere.
- Animated gradients on every card or section.
- Thick or bright borders around all containers.
- Multiple competing background patterns.
- Excessive blur/glassmorphism.
- Decorative effects that make the page feel busy or reduce performance.

## 8. Animation and Interaction

- Use subtle, purposeful motion.
- Prefer smooth transitions for hover, focus, reveal, and menu interactions.
- Animate only elements that benefit from motion.
- Keep motion consistent across the page.
- Avoid large, distracting movement and excessive parallax.
- Respect `prefers-reduced-motion`.
- Ensure animation does not cause layout shifts, or harm mobile performance.
- Avoid adding a dependency solely for a minor effect if CSS can do the job well.
- Any interactive control must actually work.

## 9. Hero Section Principles

When creating the Hero:

1. Add a small announcement badge only if it serves the content.
2. Use a strong, memorable Sora headline with clear hierarchy.
3. Keep the supporting description concise and readable.
4. Provide one clear primary CTA and an optional secondary CTA.
5. Add one distinctive visual centerpiece, such as a video interface, abstract orb, or floating interface.
6. Use restrained lighting to draw attention to the centerpiece.
7. Make the first screen feel balanced and intentional on desktop and mobile.

Do not combine every trend in one hero. Choose one main visual idea and execute it well.

## 10. Rules for Every Landing-Page Section

Each section should:

- Feel like part of the same Template #4 design system.
- Have a clear purpose and strong visual hierarchy.
- Use realistic, concise SaaS copy rather than repetitive filler.
- Use a layout suited to its content instead of reusing the same card grid everywhere.
- Include responsive behavior and sensible spacing.
- Use semantic HTML and accessible controls.
- Fit naturally with the sections already in the project.

Keep the design varied but coherent. For example, features may use a product-led grid, testimonials may use editorial quote panels, pricing may emphasize plan comparison, and FAQs may use a clean accordion.

## 11. Code Quality and Production Readiness

- Use dark theme only; don't generate toggle theme button on Navbar.
- Make sure all sections are responsive across devices mobile, tablet etc.
- Deliver complete, usable components; not pseudocode or disconnected fragments.
- Keep components readable, maintainable, and appropriately decomposed.
- Use descriptive names and proper TypeScript types.
- Avoid `any` type unless there is a compelling reason.
- Avoid duplicated markup and unnecessarily complex abstractions.
- Do not add packages without explaining why they are needed.
- Do not use placeholder links such as `href="#"` for controls that appear functional.
- Use semantic elements, accessible labels, visible focus states, and appropriate ARIA attributes where needed.
- Use optimized Next.js image handling when applicable and available.
- Check responsive behavior and likely edge cases before considering the section complete.
- If a build, lint, or type-check command is available, run the relevant check when practical and fix issues introduced by your changes.

## 12. Workflow When Asked to Build a Section

When I request a section such as Navbar, Hero, Features, Pricing, Testimonials, FAQ, CTA, or Footer:

1. Inspect the existing project files and current design before coding.
2. Identify the relevant existing components, styles, font setup, and dependencies.
3. Build the requested section to a high visual standard, production-ready while following this design system.
4. Reuse existing project conventions and shared components where appropriate.
5. Make the section responsive and accessible.
6. Verify that interactive elements work and that the code is consistent with the installed framework versions.
7. Run an appropriate check if practical.
8. Summarize which files were changed and mention any required setup or verification that remains.

Do not rebuild the entire landing page when I ask for one section. Do not overwrite unrelated work. If an important project detail is unclear, inspect the repository first and ask only when you cannot safely proceed.

## 13. Final Design Checklist

Before finishing any section, verify:

- [ ] The section follows the midnight / violet / blue design identity.
- [ ] Sora headings and Inter body text are used consistently.
- [ ] Contrast and text readability are strong.
- [ ] Spacing, borders, radii, and buttons feel consistent.
- [ ] The layout works on mobile, tablet, and desktop.
- [ ] Interactive elements are functional and accessible.
- [ ] Motion is subtle and respects reduced-motion preferences.
- [ ] There are no unnecessary dependencies or unrelated file changes.
- [ ] The result feels polished, distinctive, and commercially usable.

**Primary principle:** Build a premium, production-ready, dark SaaS experience through typography, composition, gradient and motion.
