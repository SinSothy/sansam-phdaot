# Phdaot - Advanced Design System & Productivity Workspace

A state-of-the-art Next.js 14 productivity application featuring responsive modules inspired by industry leaders like Trello, Google Calendar, and Microsoft OneNote.

## Architecture & Structure
The project leverages the **Next.js App Router** paradigm, keeping logic highly localized to specific routes to avoid component bloat.

- **`src/app/`**: Contains the core route modules.
  - `/daily-activity`: A heavy calendar clone matching Google Calendar's intricate day/week views.
  - `/noted`: An infinite canvas freeform editor with OneNote features (draggable nodes, zoom, attachments).
  - `/planner`: Team project boards inspired by Trello.
- **`src/components/ui/`**: Reusable atomic UI built around Tailwind CSS utility classes.
- **`src/components/layout/`**: Global shell components (Sidebar, Topbars) persistent across all routes.
- **`src/components/dashboard/`**: Reusable dashboard cards and metrics visualizations.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** (Strict minimal utility-first styling)
- **Lucide Icons** / **Google Material Symbols**
- **Playwright** (End-to-End Testing)
