---
name: Cinematic Noir
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#9acbff'
  on-secondary: '#003355'
  secondary-container: '#0099f3'
  on-secondary-container: '#002e4e'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#9acbff'
  on-secondary-fixed: '#001d34'
  on-secondary-fixed-variant: '#004a79'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-muted: '#121212'
  text-secondary: '#E5E5E5'
  border-metallic: '#2A2A2A'
  glow-accent: rgba(24, 160, 251, 0.3)
typography:
  headline-display:
    fontFamily: Sora
    fontSize: 84px
    fontWeight: '600'
    lineHeight: 92px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.2em
  label-mono:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 24px
  section-gap: 160px
---

## Brand & Style

The design system embodies a premium, futuristic aesthetic tailored for a high-end creative development studio. The personality is "Cinematic Noir"—mysterious, authoritative, and technically precise. It targets elite brands and visionary partners who value intentionality and artistic depth.

The visual style is a fusion of **Minimalism** and **Glassmorphism**, leaning heavily on a high-contrast palette. It utilizes vast negative space to create an editorial rhythm, where content is treated like high-art gallery pieces. The emotional response should be one of quiet confidence, technical mastery, and "quiet luxury."

## Colors

The palette is rooted in deep obsidian tones to provide maximum depth.
- **Primary:** High-contrast White (#FFFFFF) is reserved for primary headers and critical calls to action.
- **Secondary:** An Electric Azure (#18A0FB) is used sparingly as a "technical glow" or interactive accent, reminiscent of futuristic instrumentation.
- **Neutral:** The foundation is a True Black (#050505), creating a void-like canvas that allows imagery to pop.
- **Accents:** Off-whites and metallic grays provide the necessary hierarchy for secondary information without breaking the cinematic immersion.

## Typography

The typography system relies on a "Scale Contrast" philosophy. Massive, geometric headlines in **Sora** create an immediate visual impact, while **Inter** ensures that body copy remains legible and functional. **Geist** is introduced for technical micro-labels and navigational elements, emphasizing the studio's development capabilities.

Uppercase micro-labels should be used for section headers and metadata to provide a structured, architectural feel. Line heights for body text are generous (1.75x) to maintain the breathable, editorial quality of the design.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to ensure a controlled editorial experience, transitioning to a fluid model for mobile devices.
- **Desktop:** 12-column grid with a maximum width of 1440px. 
- **Gaps:** Large "Section Gaps" (160px+) are used to separate different creative narratives, preventing the UI from feeling cluttered.
- **Alignment:** Elements should frequently "break the grid" with asymmetrical placements or significant offsets to create a dynamic, avant-garde feel.
- **Mobile:** Elements stack vertically with a focus on high-impact full-bleed imagery and simplified typography scales.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Subtle Blurs** rather than traditional drop shadows.
- **Surfaces:** Secondary surfaces use a slightly lighter black (#121212) with a 1px border (#2A2A2A) to define boundaries.
- **Glows:** Instead of shadows, "Inner Glows" and "Atmospheric Blurs" are used. Interactive elements should emit a soft, low-opacity azure or white aura upon engagement.
- **Glassmorphism:** Use backdrop filters (blur: 20px) exclusively for navigation bars and modal overlays to maintain a sense of environmental depth without sacrificing the "dark mode" aesthetic.

## Shapes

The shape language is sharp and precise. A "Soft" (4px - 8px) corner radius is the maximum allowed for cards and buttons, maintaining a professional, engineered look. Occasional "Sharp" (0px) corners should be used for large structural containers or hero images to reinforce the brutalist-minimalist influence.

## Components

- **Buttons:** Primary buttons feature a solid white background with black text. Secondary buttons are outlined with a 1px metallic border that glows softly on hover. Transitions must be timed at 400ms with an `ease-out` curve.
- **Cards:** Project cards should implement a "3D Tilt" effect on hover. Content within cards is kept to a minimum (Title + Year), appearing only on interaction or via a subtle persistent micro-label.
- **Inputs:** Fields are defined by a single bottom border (1px). Focus states trigger a vertical expansion of the border or a subtle color shift to the secondary azure.
- **Project Grids:** Use an alternating "Masonry" style with varied aspect ratios to mimic a film strip or gallery wall.
- **Navigation:** A floating, glassmorphic header with minimal icons and high-kerning uppercase labels.