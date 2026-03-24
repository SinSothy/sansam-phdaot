# Contributing Guidelines & Structural Rules

As a developer working on the Phdaot platform, you must adhere strictly to these architectural boundaries. The application deals with highly complex, sprawling UI clones (Calendar, Trello, OneNote). Maintaining strict separation of concerns is the only way to prevent the `components` directory from becoming unmaintainable.

## 1. Route-Specific Component Banishment
If a component belongs solely to a single application route (e.g., `NoteEditor` is only used in `/noted`), **you must place it in `src/app/[route-name]/components/`**. 
- **DO NOT** clutter the global `src/components` folder with route-specific logic.
- The global `src/components` folder is reserved strictly for shared layouts, atomic generic UI (buttons, inputs), or completely agnostic dashboard widgets.

## 2. Shared Atomic Components (`src/components/ui`)
Generic, logic-less components must be placed here.
- Components in this folder must accept standard React props and handle no specialized local state.
- They must use standard Tailwind classes.

## 3. Styling Rules
- **Tailwind CSS ONLY**. Do not create new CSS files or use inline styles unless absolutely necessary (e.g., dynamic transforms/coordinates in the infinite canvas).
- Use the CSS variables defined in `globals.css` via Tailwind config (e.g., `bg-surface-container`, `text-primary`) rather than hardcoded hex values to support global theming.

## 4. UI Stability
- When adding logic or state to an existing component, **always preserve the visual DOM structure**. If you must wrap elements to pass refs or context, ensure flexbox and grid parameters are maintained on the wrapper.

## 5. Automated Testing
- Any heavily interactive, complex canvas/board modification must have an accompanying End-to-End (E2E) test verifying core flows (e.g., drag and drop, calendar date switching, task creation).
