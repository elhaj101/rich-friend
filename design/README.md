# Handoff: Rich Friend — Luxury Personal Shopping Concierge Website

## Overview
A website for a luxury personal shopping concierge service ("Rich Friend"). Clients in the Middle East (Qatar, UAE, Saudi Arabia, Turkey) request fashion, watches, jewelry and other luxury goods; a personal shopper sources and purchases the exact item in Europe on their behalf. The value proposition is access, authenticity and an official receipt — not a discount. Brand tone: quiet luxury, editorial, private-members'-club — not e-commerce.

## About the Design Files
The files in this bundle are **design references built as an HTML/JS prototype** (a "Design Component" using a custom template runtime — `support.js`, `<sc-for>`/`<sc-if>` template tags, `{{ }}` bindings). This is **not production code** and should not be copied into a real app as-is. The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, native, etc.), using its established component library, state management and routing patterns. If no frontend framework exists yet in the target repo, choose the most appropriate one for a marketing/concierge site (e.g. Next.js/React) and implement there.

The single file `Luxury Concierge Website.dc.html` currently lays out several views **side by side as an internal review/options canvas** (each wrapped in a `<div class="dv-opt" id="1a">` etc. with a small id badge). This is a working-review artifact, not the shipped page structure — in production each block becomes its own routed page/section, stacked vertically in normal document flow, not side-by-side.

## Fidelity
**High-fidelity.** Colors, typography, spacing and copy are final/near-final for the committed direction (option **1a**, full-bleed editorial hero). Build pixel-accurately from the values below, adapted to the target codebase's design-system primitives where they already exist (e.g. reuse existing Button/Card components with these visual tokens rather than the raw markup).

## Screens / Views
Each corresponds to one `<div class="dv-opt" id="…">` block in the HTML.

### 1. Homepage Hero + Header (`#1a`)
- **Purpose**: First impression; states the core promise, links to primary nav, funnels to "Become a member" (Request a Purchase) CTA.
- **Layout**: Fixed-width card 900px wide in the prototype (design intent: full-bleed, edge-to-edge in production). Header is a flex row, `space-between`, 22px/40px padding, 1px bottom border `rgba(27,25,22,0.1)`. Hero below is `position:relative`, 520px tall (desktop; make this viewport-relative, e.g. 80–90vh, in production), `overflow:hidden`.
- **Components**:
  - **Logo/wordmark** "Rich Friend": Cormorant Garamond, 600 weight, 15px, letter-spacing 0.14em, color `#1B1916`.
  - **Nav links**: "Order From Europe", "SERVICES", "TRUST", "ABOUT" — Inter 500, 11px, letter-spacing 0.04em, color `rgba(27,25,22,0.7)`, flex row gap 28px.
  - **Nav CTA button** "Become a member": Inter 600 11px, letter-spacing 0.05em, padding 10px 18px, 1px solid border `#1B1916`, text color `#1B1916`, no fill (outline button).
  - **Hero image**: full-bleed photo (currently a user-uploaded product/leather-goods photo), animated with a continuous slow zoom (see Interactions below).
  - **Hero gradient overlay**: `linear-gradient(0deg, rgba(20,18,15,0.55), rgba(20,18,15,0.15))` over the image for text legibility.
  - **Hero headline**: Cormorant Garamond 500, 52px/1.1, color `#F4F1E8`, max-width 560px, centered — "Your personal shopper in Europe."
  - **Hero subhead**: Inter 400, 15px/1.6, color `rgba(244,241,232,0.85)`, max-width 440px, margin-top 20px — "We bring your product to you in Qatar, UAE, Saudi Arabia or Turkey."

### 2. Editorial Statement Section (`#1c`)
- **Purpose**: Reinforces brand values (hand-service, no negotiation) with a full-bleed photographic backdrop between the hero and deeper content — a breathing/pause section.
- **Layout**: `position:relative`, padding 140px 72px, centered text, `overflow:hidden`.
- **Components**:
  - **Background photo** (`background-size:cover; background-position:center`) with dark scrim: `linear-gradient(180deg, rgba(20,18,15,0.55), rgba(20,18,15,0.75))`.
  - **Copy block** (max-width 560px, centered): headline in Cormorant Garamond 500 34px/1.35, color `#F4F1E8` — "Every request handled by hand,"; two body paragraphs Inter 400 15px/1.7, color `rgba(244,241,232,0.85)`.
  - **CTA band below** (background `#EAE3D2`, padding 56px, centered): headline "Tell us what you're looking for." (Cormorant Garamond 500 28px, color `#1B1916`), solid button "Become a member" (Inter 600 11px, padding 14px 28px, background `#1B1916`, text `#F4F1E8`).

### 3. Styling Suite — Video Consultation (`#1d`)
- **Purpose**: Markets the live video-call styling/consultation service — a key differentiator (personal, real-time advice, no purchase obligation).
- **Layout**: Centered intro block (padding 80px 56px 48px) → two-column grid (1.35fr / 1fr, gap 16px) showing a mock video-call UI beside three benefit cards → a row of three trust bullets → a dark closing CTA bar.
- **Components**:
  - **Kicker**: "THE STYLING SUITE" — Inter 600 11px, letter-spacing 0.2em, color `#A3803D`.
  - **Headline**: "Meet your stylist face to face — from your home." Cormorant Garamond 500 40px/1.15, `#1B1916`, max-width 560px.
  - **Body**: Inter 400 14px/1.7, `rgba(27,25,22,0.6)`, max-width 480px.
  - **Mock video call panel** (left, 420px tall, background `#1B1916`): full-bleed stylist photo with bottom gradient scrim; a "LIVE · YOUR STYLIST, PARIS" pill top-left (green 7px dot `#25D366` + blurred dark pill, Inter 600 10px letter-spacing 0.08em, `#F4F1E8`); a small self-view thumbnail bottom-right (96×120px, rounded 10px, 2px border `rgba(244,241,232,0.5)`); a call-control bar at the bottom-center with 3 circular buttons (mute — translucent light; camera — solid `#A3803D`; hang-up — `#C0392B`, all 44px circles).
  - **Three benefit cards** (right column, background `#EAE3D2`, equal flex, padding 26px 28px): numbered 01/02/03 in Cormorant Garamond 600 32px `#A3803D`, title Cormorant Garamond 600 17px `#1B1916`, body Inter 400 12.5px/1.6 `rgba(27,25,22,0.6)`. Copy: "A wardrobe read, first" / "Live from the boutique" / "A tailored edit, after".
  - **Trust bullet row** (padding 20px 56px 72px, flex-wrap, gap 40px): three items, each a 7px `#A3803D` dot + Inter 400 12.5px `rgba(27,25,22,0.7)` label — "Available in Arabic & English", "WhatsApp video or scheduled call", "No obligation to purchase".
  - **Closing CTA bar** (background `#1B1916`, padding 44px 56px, flex space-between): message "Reserve a private styling call with your personal shopper." (Cormorant Garamond 500 22px/1.3, `#F4F1E8`) + solid button "Book a consultation" (background `#A3803D`, text `#1B1916`, Inter 600 11px).

### 4. Trust & Authenticity (`#1e`)
- **Purpose**: Dedicated trust section — addresses the core objections (is it real? is it worth it? is it discreet?) via an interactive tabbed pillar list plus a client-quote closer.
- **Layout**: Centered intro (padding 88px 56px 64px) → interactive two-column module (300px sidebar nav / flexible detail panel, `grid-template-columns:300px 1fr`) → full-bleed quote section with photo backdrop.
- **Components**:
  - **Kicker/headline/body**: same pattern as other sections — "TRUST & AUTHENTICITY" kicker (`#A3803D`), headline "The price you'd pay in Paris. The proof to match." (Cormorant Garamond 500 40px, `#1B1916`), body Inter 400 14px/1.7 `rgba(27,25,22,0.6)`.
  - **Interactive pillar list** (left, 300px): 4 clickable rows, each with a number (Inter 600 11px letter-spacing 0.12em) and label (Cormorant Garamond 600 15px). **Active row state**: 2px left border `#A3803D`, background tint `rgba(163,128,61,0.06)`, number color `#A3803D`, label color `#1B1916`. **Inactive**: transparent left border, number `rgba(27,25,22,0.35)`, label `rgba(27,25,22,0.45)`. Hover: subtle background `rgba(27,25,22,0.03)`. Rows: "Authenticity, in writing" / "The original receipt" / "Vetted shoppers" / "Discretion by default".
  - **Detail panel** (right, background `#1B1916`, padding 52px 48px, min-height 300px): large pillar number (Cormorant Garamond 600 64px, `#A3803D`), title (Cormorant Garamond 500 28px, `#F4F1E8`), body copy (Inter 400 15px/1.75, `rgba(244,241,232,0.72)`), and a small "proof chip" pill (bordered `rgba(163,128,61,0.5)`, 6px gold dot + label in Inter 600 10px letter-spacing 0.1em `#D8C08A`) — e.g. "SIGNED GUARANTEE" / "BOUTIQUE INVOICE INCLUDED" / "HAND-SELECTED, EUROPE-BASED" / "CONFIDENTIAL HANDLING".
  - **Client quote section**: full-bleed photo background with dark scrim `rgba(20,18,15,0.78)`, centered italic-style quote (Cormorant Garamond 500 26px/1.4, `#F4F1E8`, max-width 560px) and attribution (Inter 600 11px letter-spacing 0.12em, `#D8C08A`) — "— A CLIENT IN DOHA".

### 5. Footer (`#1f`)
- **Purpose**: Standard site-wide footer with brand statement, sitemap links, concierge contact channels, and legal.
- **Layout**: Single dark block (`#1B1916`, padding 64px 56px 32px). Top row: 3-column flex (1.5 / 1 / 1 fr), bottom-bordered `rgba(244,241,232,0.14)`, padding-bottom 44px. Bottom row: flex space-between, wraps on small screens, padding-top 24px.
- **Components**:
  - **Brand column**: wordmark (Cormorant Garamond 600 18px, letter-spacing 0.14em, `#F4F1E8`), one-line brand statement (Inter 400 13px/1.7, `rgba(244,241,232,0.6)`, max-width 280px) — "A private shopping concierge for those who seek what isn't available at home — not a discount." Below it, a **WhatsApp chat pill**: background `#25D366`, rounded 6px, padding 12px 18px, a small icon + "Chat on WhatsApp" (Inter 600 12px, `#1B1916`).
  - **"EXPLORE" column**: label in Inter 600 10px letter-spacing 0.14em `#A3803D`; links (Inter 400 13px, `rgba(244,241,232,0.7)`, 12px gap, stacked): How It Works, What We Source, Trust & Authenticity, About.
  - **"CONCIERGE" column**: same label style; items: Become a member, WhatsApp, concierge@richfriend.co, Mon–Sat 9–21 GST.
  - **Legal row**: copyright/pricing-transparency line (Inter 400 11px, `rgba(244,241,232,0.4)`) — "© 2026 Rich Friend. All purchases made at official retail price; our fee covers sourcing and service." Right side: Privacy / Terms / العربية (language link), same style, gap 22px.

## Interactions & Behavior
- **Hero zoom loop** (section 1): background photo continuously animates scale 1.35 → 1.0 → 1.35 over a 3s ease-in-out loop, infinite (`@keyframes heroZoomOut`). Recreate as a CSS animation or an equivalent `transform: scale()` loop (e.g. Framer Motion `animate` with `repeat: Infinity, repeatType: 'mirror'`, duration 1.5s each direction).
- **Trust pillar tabs** (section 4): clicking a sidebar row sets it "active" and swaps the detail panel content (number, title, body, proof chip) with a state variable (`trust: 0–3`, default 0). No transition specified in the prototype but a soft cross-fade (150–200ms) on the detail panel is recommended for polish.
- **Language toggle**: the prototype includes an EN ⇄ AR toggle (button pair, active state solid dark) that switches all copy and sets `dir="rtl"`/`dir="ltr"` on the page root, alongside swapping fonts (see Design Tokens). Only the top-level marketing copy dictionary shown in the file is localized; the Trust/Styling-Suite sections built in this second pass are currently English-only — extend the dictionary pattern to them if AR is needed there too.
- **Nav/CTA buttons**: no defined hover/active styles beyond default — apply the target design system's standard button hover treatment (e.g. slight darken/lighten, no drastic color change — keep restrained per brand tone).
- **Responsive behavior**: not explicitly designed per-breakpoint in this second pass (sections 2–5). Follow the same mobile adaptation pattern used for the homepage/how-it-works/request-flow in the original multi-viewport build (stack columns vertically, reduce type scale ~30–40%, reduce section padding to ~40–56px vertical / 20–22px horizontal). The video-call mock UI element and the trust two-column module should both stack to single-column on mobile, image/video panel on top, text below.

## State Management
- `lang`: `'en' | 'ar'` — drives copy dictionary lookup, font-family swap, and `dir` attribute.
- `trust`: `0–3` — index of the active Trust & Authenticity pillar; drives the right-hand detail panel content.
- (From the wider flow, present elsewhere in the file) `reqStep`: `0–3` — Request-a-Purchase wizard step index, with next/prev handlers clamped to bounds.

## Design Tokens

### Colors
- Ivory / background: `#F4F1E8` (primary), `#EDEAE0` (canvas/alt)
- Charcoal / dark: `#1B1916` (near-black, used for text, dark sections, buttons)
- Accent gold/bronze: `#A3803D` (primary accent), `#D8C08A` (light gold, used on dark backgrounds for kickers/labels)
- Warm neutral band: `#EAE3D2` (secondary section background, CTA bands)
- WhatsApp green: `#25D366` (contact CTA only)
- Alert/hang-up red: `#C0392B` (video-call mock UI only)
- Text-on-dark: `#F4F1E8` at full opacity; secondary at `rgba(244,241,232,0.6–0.85)`
- Text-on-light: `#1B1916` at full opacity; secondary at `rgba(27,25,22,0.4–0.7)`

### Typography
- Headline serif: **Cormorant Garamond**, weights 400/500/600. Arabic equivalent: **Noto Naskh Arabic**, weights 500/600.
- Body sans: **Inter**, weights 400/500/600. Arabic equivalent: **IBM Plex Sans Arabic**, weights 400/500/600.
- Scale used: 64px (giant numerals) / 52px / 40–42px / 34px / 28px / 26px / 22px / 18–19px / 15–17px / 13–14px / 11–12px (labels/kickers, usually letter-spacing 0.1–0.2em, uppercase).

### Spacing / Layout
- Section vertical padding: 44–140px depending on section weight (hero > standard > CTA band).
- Section horizontal padding: 56px desktop.
- Card/grid gaps: 12–16px (tight compositions), 32–64px (column layouts).
- Border radius: minimal use — 4px (chips), 6px (WhatsApp pill), 10px (video thumbnail); most surfaces are square-cornered (brand favors sharp edges over rounded, consistent with "quiet luxury" positioning).

### Borders / Dividers
- Hairline dividers: `1px solid rgba(27,25,22,0.1)` (light sections), `1px solid rgba(244,241,232,0.14)` (dark sections).
- Outline buttons: `1px solid #1B1916` (light), no fill.

## Assets
- Hero photo (section 1) and background photo (sections 2 & 4 quote band): user-uploaded images, stored in `uploads/` in this bundle. Replace with final brand photography — European fashion capitals, product close-ups — per brand direction (no stock-photo look).
- Video-call mock photos (section 3): temporary Unsplash placeholders (`v3-call`, `v3-self`) — must be replaced with real photography or an actual product screenshot of the video-call UI before ship.
- No custom icons/SVGs — all iconography in the prototype is built from basic CSS shapes (circles, borders) as placeholders; source a minimal icon set (or commission custom line icons) consistent with the restrained brand tone for production.

## Files
- `Luxury Concierge Website.dc.html` — full prototype source (all sections, including the homepage/how-it-works/request-purchase flow from the first design pass, plus the four sections detailed above from this pass). Sections are laid out side-by-side for review (`id="1a"`, `"1c"`, `"1d"`, `"1e"`, `"1f"`) — treat each as an independent screen/section reference, not the literal shipped DOM structure.
- `image-slot.js` — a prototype-only helper web component (drag-and-drop image placeholder). Not needed in production; production `<img>`/`background-image` should point directly at final assets.
- `uploads/` — the user-provided photos referenced by the prototype.
