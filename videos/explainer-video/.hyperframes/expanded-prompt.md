# Cinematic Explainer Video — Production Specification

This document details the cinematic scene-by-scene storyboard and motion specifications for the Athena Stock explainer video, expanded from the user's prompt using the HyperFrames skill rules.

---

## 1. Visual Style & Tokens

- **Visual Style:** Shadow Cut (Noir, High-Contrast Cinematic)
- **Primary Background:** `#020216` (Deep Dark Navy)
- **Primary Foreground:** `#fff2e2` (Warm Peach Text)
- **Surface Panels:** `#11112b` (Deep Slate Navy)
- **Accent Highlight:** `#bb5504` (Burnt Bronze)
- **Typography:**
  - Headline Font: `Oswald` (Google Fonts, Bold, Uppercase)
  - Body & Paragraph Font: `Plus Jakarta Sans` (Google Fonts, Clean Modern Sans)
  - Technical Data/Labels: `Space Mono` (Google Fonts, Monospace)

---

## 2. Rhythm Declaration
**Pattern:** `hook-PUNCH-breathe-CTA`
- **Total Duration:** 15.0 seconds
- **Frame Rate:** 30 fps
- **Resolution:** 1920x1080 (Landscape)

---

## 3. Global Rules
- **No Jump Cuts:** All scene transitions are handled via designated blurs or pans.
- **Ambient Motion:** All background layers contain active, slow-moving properties (opacity pulsing, scale shifting) to prevent compression banding and keep frames "alive".
- **Deterministic Easing:** Use custom cubic-bezier properties for all transitions.
- **Asymmetric Timing:** Entrances take longer to build (0.6s - 0.8s) than exits (0s - 0.3s) where transition handles exit.

---

## 4. Scene Storyboard Specifications

### Scene 1: The Hook (0.0s – 3.0s)
* **Concept:** The video opens on a dark void. A radial bronze glow gently breathes as the words "ATHENA STOCK" slam into place, divided by a thin bronze line that draws across the screen.
* **Mood:** Cinematic title sequence. Focus, anticipation.
* **Depth Layers:**
  - *BG:* `#020216` solid canvas + low-opacity radial bronze glow (`#bb5504`, opacity 0.15, breathing scale 1.0 -> 1.1).
  - *MG:* "ATHENA STOCK" title (Oswald, 100px, `#fff2e2`) and subtitle "Đầu tư tỉnh thức" (Plus Jakarta Sans, 32px, `#fff2e2`).
  - *FG:* Hairline divider line (width 600px, height 2px, `#bb5504`).
* **Animation Choreography:**
  - At 0.2s: Title "ATHENA STOCK" slams in (`y: -40 -> 0`, `opacity: 0 -> 1`, duration 0.6s, ease: `power3.out`).
  - At 0.4s: Bronze divider line draws out from center (`scaleX: 0 -> 1`, duration 0.5s, ease: `power2.out`).
  - At 0.6s: Subtitle "Đầu tư tỉnh thức" fades up (`y: 30 -> 0`, `opacity: 0 -> 1`, duration 0.6s, ease: `sine.out`).
* **Transition Out:** Blur crossfade (0.5s, ease: `power2.inOut`) starting at 2.5s.

---

### Scene 2: Core Pillars (3.0s – 8.0s)
* **Concept:** Three clean slate panels representing the pillars of mindful investing slide onto the screen, staggered left to right, creating a structured financial dashboard layout.
* **Mood:** Analytical, structured, clean.
* **Depth Layers:**
  - *BG:* Grid lines and small coordinate tags (`01`, `02`, `03` in Space Mono, `#bb5504`, opacity 0.2).
  - *MG:* Three cards (width 450px, height 500px, background `#11112b`, border `2px solid #bb5504` top-edge).
    - Card 1: "Business Mindset"
    - Card 2: "Margin of Safety"
    - Card 3: "Behavioral Control"
  - *FG:* Small monospaced category tags on top-left of cards.
* **Animation Choreography:**
  - At 3.2s: Card 1 slides in from left (`x: -100 -> 0`, `opacity: 0 -> 1`, duration 0.6s, ease: `power3.out`).
  - At 3.4s: Card 2 slides up from bottom (`y: 100 -> 0`, `opacity: 0 -> 1`, duration 0.6s, ease: `power3.out`).
  - At 3.6s: Card 3 slides in from right (`x: 100 -> 0`, `opacity: 0 -> 1`, duration 0.6s, ease: `power3.out`).
  - At 3.8s: Card descriptions fade in (`opacity: 0 -> 1`, duration 0.4s).
* **Transition Out:** Whip pan right (0.4s, ease: `power3.inOut`) starting at 7.6s.

---

### Scene 3: The Philosophy (8.0s – 11.5s)
* **Concept:** A large editorial quote from Warren Buffett fades in word-by-word over a textured dark canvas, drawing focus to the core philosophy of patience.
* **Mood:** Classic editorial page, reflective and calm.
* **Depth Layers:**
  - *BG:* Soft gradient background, slow-moving atmospheric light leaks (`opacity: 0.1`).
  - *MG:* Large italicized quote block (Plus Jakarta Sans, 46px, `#fff2e2`) and attribution line (Space Mono, 24px, `#bb5504`).
  - *FG:* Decorative quotation mark icon in upper-left.
* **Animation Choreography:**
  - At 8.2s: Large quotation mark slides down (`y: -20 -> 0`, `opacity: 0 -> 0.3`, duration 0.6s).
  - At 8.4s: Quote text blocks fade in sequentially (`opacity: 0 -> 1`, duration 0.8s, ease: `power2.out`).
  - At 9.2s: Attribution "— Warren Buffett" fades in from right (`x: 20 -> 0`, `opacity: 0 -> 1`, duration 0.6s).
* **Transition Out:** Blur crossfade (0.5s, ease: `power2.inOut`) starting at 11.0s.

---

### Scene 4: The Call to Action (11.5s – 15.0s)
* **Concept:** The video resolves back to the brand. A clean layout containing the website CTA slides up while the background elements fade to a dark vignette.
* **Mood:** Confident resolve, call to action.
* **Depth Layers:**
  - *BG:* Soft radial bronze gradient overlay.
  - *MG:* CTA title "Sẵn sàng đầu tư tỉnh thức?" (Oswald, 72px) and domain name "athenastock.com" (Space Mono, 48px, `#bb5504`).
  - *FG:* Tiny coordinate labels and registration ticks.
* **Animation Choreography:**
  - At 11.7s: Title "Sẵn sàng đầu tư tỉnh thức?" slides up (`y: 40 -> 0`, `opacity: 0 -> 1`, duration 0.7s, ease: `back.out(1.2)`).
  - At 12.0s: Domain text "athenastock.com" reveals with expanding letter-spacing (`letterSpacing: 0.05em -> 0.15em`, `opacity: 0 -> 1`, duration 0.8s, ease: `power3.out`).
  - At 14.0s: Complete screen fades to black (`opacity: 1 -> 0`, duration 1.0s).
