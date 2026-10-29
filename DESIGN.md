---
name: Bio/CS Foundations Lab
description: An editorial biology learning surface with controlled scientific mechanism experiments.
colors:
  ink: "#10264b"
  blue: "#1b55b5"
  blue-dark: "#15448f"
  blue-pale: "#edf4ff"
  muted: "#47617f"
  line: "#d4e1f0"
  paper: "#f8fbff"
  white: "#fff"
typography:
  lesson-title:
    fontFamily: 'Georgia, "Noto Serif SC", "Songti SC", serif'
    fontSize: "clamp(34px, 4vw, 54px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.046em"
  question:
    fontFamily: 'Georgia, "Songti SC", serif'
    fontSize: "clamp(25px, 3vw, 34px)"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: 'Inter, "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif'
    fontSize: "16px"
    lineHeight: 1.75
  equation:
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace'
    fontSize: "14px"
    lineHeight: 1.8
rounded:
  control: "4px"
  panel: "5px"
spacing:
  control: "10px 14px"
  desktop-gutter: "42px"
  mobile-workbench-gutter: "20px"
components:
  workbench-button:
    backgroundColor: "{colors.white}"
    textColor: "#234e83"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
  workbench-button-selected:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
---

# Design System: Bio/CS Foundations Lab

## Overview

Foundations Lab uses a white and pale blue reading surface, navy text, serif scientific questions and restrained blue controls. Ruled sections, numbered steps, visible units and adjacent interpretations connect a biological process to what an experiment actually measures. Chinese explanations retain English biological names.

This is a source-based record of the incumbent `foundations-lab.css` and the extension in `mechanism-workbench.js` / `mechanism-workbench.css`, including the inherited body type from `styles.css`. It documents this learning surface, not a replacement identity for the wider site. No rendered validation is claimed here.

## Colors

Blue marks actions, selected topics, current steps, range controls and source links. Navy provides the reading hierarchy; muted blue gray supports explanation and labels. White panels sit on pale paper, separated by fine blue gray rules. The existing hero map and closing section use a dark navy surface.

Scientific curves use their own blue, teal, plum and gray mapping with text legends. A dashed reference curve is explicitly named. Existing Foundations Lab boundaries and active sequence positions also use local warm accents; these remain scientific or explanatory states rather than new navigation colors.

## Typography

Georgia with Chinese serif fallbacks defines the hero, lesson headings and mechanism questions. Sans serif body text and controls inherit the existing stack. Mechanism introductions use (16px) with line height (1.85); step explanations use (15px) with the same line height. Formula readouts use the equation token, while slider values and calculated results use tabular numerals.

The new mechanism heading uses `clamp(30px, 3.8vw, 46px)`. Its question is limited to (36ch), introductory prose to (74ch) and step explanations to (76ch). At or below (600px), the question uses (27px) and numerical results reduce from (21px) to (19px).

## Layout

Foundations lessons have a maximum width of (1320px), desktop gutters of (42px) and a playground/interpretation grid. At or below (930px), this grid becomes one column; below (650px), the reading surface uses compact (19px) gutters. The sticky header remains part of the existing navigation.

The workbench extends that flow with one selected mechanism at a time. Parameter controls use three columns, two at or below (900px), and one at or below (600px). Topic selectors and manual step buttons become two-column grids on the narrow layout. The four-part calculation process becomes two columns at or below (900px). At or below (600px), the workbench uses (20px) side padding.

**The Legible Figure Rule.** Keep the SVG's (640px) minimum width inside its own labeled, keyboard focusable horizontal scroll region. Curves use a (640 × 300) viewBox and retain their axes, units, current markers and legends. Text readouts wrap below the figures independently of SVG scrolling; surrounding prose and controls should fit the viewport.

## Elevation & Depth

Fine borders and pale fills provide most structure. Existing playground and interpretation panels have a restrained shadow (`0 15px 35px rgba(30,77,137,.045)`); the dark hero map uses a stronger shadow (`0 20px 45px rgba(26,68,124,.13)`). The mechanism workbench relies on rules, flat plot backgrounds and selected fills rather than elevated cards.

## Shapes

Controls retain small corners using the control radius; plots and existing panels use the panel radius. Editorial sections remain straight and ruled. Numbered navigation markers and plotted current values are circles, while process arrows explain order. Keep these geometries attached to navigation or the scientific quantity they represent.

## Components

### Controls and current values

Topic buttons use an underline and blue text for selection, with `aria-pressed`. Native labeled ranges show an adjacent output and units; enzyme inhibition also uses a native select. Step and action buttons have a minimum height of (42px), outlined white defaults and blue selected states. Disabled check/play controls remain visibly distinct. The workbench focus treatment is a blue (3px) outline with a (4px) offset; existing Foundations Lab controls retain their incumbent warm focus outline.

### Mechanism figures and calculation

The four experiments cover enzyme initial rates, receptor binding versus response, RNA/protein turnover and drift versus selection. Enzyme and receptor figures compare named curves; RNA/protein uses two separate time plots; population plots show three seeded realizations and a dashed selection-only reference. All current markers and numerical readouts derive from the same active model state.

A four-part process row, explicit equation and definition-list results connect the figure to its calculation. Accessible SVG names include the current x value and series values. Numerical results remain readable outside the SVG and announce changes politely while playback is stopped. Named derivation steps are selected manually and update an adjacent live explanation.

### Prediction, reset and playback

Prediction checks use a fieldset, legend and radio labels. The check button stays disabled until a choice exists; changing a choice clears its feedback, and checking displays an explanatory status message. Settings, limitations and troubleshooting use a native disclosure. Synthetic-example boundaries, source links and the Deep Learning Atlas connection remain in the same reading flow.

Reset restores the selected model's parameters and first derivation step; the current implementation preserves that topic's quiz choice and submitted feedback. Topic changes also return to the first step while retaining each topic's parameter state. Population has a separate action that changes the seeded realization.

Playback is available only for expression time and population generation. It starts from zero, advances one unit every (600ms), and stops at the endpoint. Parameter input, manual step/topic/action clicks, pause and a hidden document stop playback. Result announcements are off while playing and return to polite when stopped. Reduced motion disables playback when rendered and prevents starting or continuing it; manual ranges and steps remain available. The workbench's (180ms) control color transitions run only when reduced motion is not requested. Existing Foundations Lab sequence, composition and bar transitions likewise honor reduced motion.

## Do's and Don'ts

- **Do** preserve the established serif/sans relationship, white/navy reading surface, blue controls and ruled sections.
- **Do** keep labels, units, current values, assumptions and model limits adjacent to the figure they explain.
- **Do** preserve native input semantics, visible focus, manual operation and local figure scrolling.
- **Don't** shrink scientific axes into unreadable mobile labels or rely on color alone to distinguish curves.
- **Don't** treat seeded paths, toy curve shapes or playback as measured data or independent evidence of a biological mechanism.
- **Don't** describe the model reset as clearing quiz progress; the implemented reset scope is parameters and derivation step.


## Omics Workbench extension

`omics-workbench.html` inherits the existing Bio/CS reading system. Three biological questions open Bulk, Single-cell or Spatial learning routes; six numeric experiments sit above the chapter library, reproducible R downloads and searchable source-to-topic mapping. Current parameter values, formulas, tables and original SVG geometry share one model state. Scientific diagrams keep local scrolling at 640px; mobile prose and controls remain within the viewport.

GSEA alone advances its ranked walk with optional 700ms playback, manual stepping and a full-ranking action. Playback stops on parameter/topic changes, a hidden document and reduced motion. Reset explicitly clears both the current model parameters and prediction answer. Native controls preserve focus and disable prediction checking until an answer exists. No measurements or inferential significance are invented for the synthetic examples.
