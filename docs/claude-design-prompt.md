# Claude Design Prompt — Life by Design Explorations

Copy everything below into Claude Design.

---

Design and prototype **three genuinely different responsive visual directions** for a small educational web experience called **Life by Design**.

This is an independent, non-commercial learning experience inspired by the high-level frameworks in *Designing Your Life* by Bill Burnett and Dave Evans. It is not affiliated with the authors or publisher. Use original explanatory language and visuals; do not reproduce the book cover, long passages, diagrams, or proprietary page layouts.

## Product purpose

Help people pause, take stock of their lives, imagine more than one meaningful future, and identify a small experiment they can try next.

The primary design audience is a group of thoughtful single professionals in their late 30s living in the Bay Area. They are accomplished but do not want another career-optimization tool. They want to build full lives across health, relationships, community, work, place, play, and meaning. The experience should still feel welcoming to a broad adult audience.

## Emotional goal

The experience should feel:

- Calm enough for honest reflection
- Thoughtful and editorial, respecting that the ideas come from a book
- Engaging enough to feel like a guided workshop
- Optimistic without becoming cheerful self-help
- Spacious, mature, tactile, and quietly alive

Avoid generic SaaS dashboards, corporate wellness, therapy-app clichés, stock photography of journaling or yoga, glassmorphism, neon AI gradients, and repetitive rounded cards.

## Shared content architecture

Every direction should demonstrate the same core journey:

1. **Opening invitation**
   - Working headline: “A full life isn’t found. It’s designed.”
   - Explain that clarity grows through noticing, imagining, and trying small experiments.
   - Primary action: “Begin with eight questions.”

2. **The five canonical designer mindsets**
   - Curiosity
   - Bias to Action
   - Reframing
   - Awareness
   - Radical Collaboration
   - Present these as the canonical mindset names from the book, using concise original explanations rather than copied passages.

3. **Life Design Dashboard**
   - Four simple segmented gas-tank gauges: Health, Work, Play, and Love
   - Each gauge has only five states: 0%, 25%, 50%, 75%, or 100% full
   - Health: body, mind, and emotional wellbeing
   - Work: contribution, craft, and livelihood
   - Play: joy without a productive purpose
   - Love: people, belonging, and mutual care
   - Frame these levels as a present-day snapshot, never as grades, targets, or a combined life score.

4. **Lifeview and Workview**
   - Lifeview prompt: “What makes a life meaningful?”
   - Workview prompt: “What is work for?”
   - Coherence prompt: “Where do these views reinforce each other—and where are they in tension?”
   - Treat each view as an evolving draft rather than a permanent manifesto.

5. **Energy Compass**
   - Let someone record a recent activity.
   - Rate both energy, from drained to energized, and engagement, from distant to in flow.
   - Show a small field-note history that helps patterns emerge over time.

6. **Odyssey Plan**
   - Three editable five-year possibilities:
     - The path already underway
     - The path if the first disappeared
     - The path without status or external constraint
   - Each path gets a short headline and a note about what makes it compelling.
   - Make it clear that the visitor is exploring, not choosing.

7. **Eight-question reflection**
   - Where in your life do you feel most alive right now?
   - What regularly leaves you feeling depleted—even when you do it well?
   - When did you last become so absorbed that you lost track of time?
   - Beyond work, which people and roles make your life feel full?
   - What belief about your future might be ready for a gentler reframe?
   - If your current path continued beautifully, what could the next five years hold?
   - If that path disappeared tomorrow, what different life would you explore?
   - If money and other people’s opinions went quiet, what would you become curious about?

8. **Closing invitation**
   - Ask: “What is one conversation your future self would be glad you started?”
   - Encourage one small conversation or experiment instead of a dramatic life decision.

## Create three distinct design directions

Do not blend these into one safe midpoint. Make each direction feel like a different creative thesis.

### Direction A — The Field Guide

An editorial field guide opened beside an alpine lake. Use warm paper, expansive turquoise water, layered pine and mountain shapes, literary serif typography, fine rules, field annotations, and small primary-color trail markers. The memorable interaction is a route gradually appearing across the landscape as the visitor completes reflections.

This direction should feel natural, contemplative, tactile, and closest to a beautifully designed book companion.

### Direction B — The Life Atlas

Treat the experience as a personal atlas rather than a linear workbook. Use contour lines, map coordinates, branching routes, marginal notes, stamps, and zoomed-in “territories” for Health, Work, Play, and Love. The Odyssey Plan becomes three routes across the same terrain. Lifeview and Workview become two translucent map layers that reveal areas of alignment and tension.

This direction should feel exploratory, intelligent, spatial, and more interactive—without looking like navigation software.

### Direction C — The Possibility Constellation

Build from the book cover’s feeling of colorful possibility without copying its dot-ring composition. Use a calm lake-blue or warm-paper field with small red, yellow, green, and blue points that gather into constellations as the visitor answers questions. Each bright point represents a clue, relationship, experiment, or possible future. Keep the dashboard recognizably segmented into four quarter-tank states, but let each filled quarter appear as a small constellation rather than a corporate progress ring.

This direction should feel poetic, contemporary, quietly playful, and visually memorable while remaining legible and mature.

## Prototype requirements

- Produce a high-fidelity responsive prototype for each direction.
- Begin with a simple concept comparison screen, then allow switching between Direction A, B, and C.
- Show at minimum the opening, dashboard, Lifeview/Workview, Odyssey Plan, and one reflection-question state for every direction.
- Demonstrate desktop around 1440px and mobile around 390px.
- Mobile layouts must be recomposed, not merely scaled down.
- Use visible labels, 44px minimum touch targets, strong contrast, keyboard focus states, and reduced-motion behavior.
- Use motion only to communicate progress, paths forming, or state changes. Avoid bounce, parallax for decoration, and constant ambient movement.
- No login, backend, social feed, scores shared with others, or AI-generated life advice.
- Notes should be described as private and saved only on the visitor’s device.

## Design-system seed

Use this palette as a starting family, but let each direction shift its proportions:

- Warm paper: `oklch(96% 0.023 83)`
- Lake blue: `oklch(78% 0.102 193)`
- Deep pine: `oklch(36% 0.075 169)`
- Ink: `oklch(23% 0.035 190)`
- Sun yellow: `oklch(88% 0.182 97)`
- Trail red: `oklch(60% 0.205 29)`
- Clear blue: `oklch(70% 0.14 239)`

Pair a distinctive literary old-style serif with a humane geometric sans. Use bright colors as rare markers of possibility rather than large decorative gradients.

## What I want back

For each direction, provide:

1. A one-sentence creative thesis
2. A short explanation of the visual metaphor
3. A desktop prototype
4. A mobile prototype
5. The dashboard, Lifeview/Workview, Odyssey Plan, and question-state treatments
6. The signature interaction that makes the direction memorable
7. The main strength and main risk of the direction

End with a comparison table evaluating the three concepts on calmness, clarity, emotional resonance, originality, mobile suitability, and ease of implementation in Next.js.
