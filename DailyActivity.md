# DailyActivity System — Product Spec

## 🎯 Goal

Build a web-based system that helps team leads manage daily work by combining:

- Daily schedule
- Notes
- Tasks
- Team assignments
- Deadlines
- Priorities

The system should reduce cognitive load and automate task extraction and tracking.

---

## 🧠 Core Problem

Users attend many meetings and take notes, but:

- Notes are not converted into actionable tasks
- Tasks are scattered across days
- Priorities are unclear
- Team assignments are not visible
- Deadlines are missed

---

## ✅ Core Features

### 1. Unified Daily View

Combine:

- Daily Activity (time-based schedule)
- Notes / To-do list

👉 UI:

- Left: Timeline (8:00 → 18:00)
- Right: Tasks extracted from notes

---

### 2. Smart Note → Task Breakdown

When user inputs notes:

- Automatically break into bullet tasks

Example:
Input:
"Fix home menu reorder and improve UI"

Output:

- Fix home menu reorder
- Improve home menu UI

---

### 3. Task Model

Each task must have:

- id
- title
- description (optional)
- priority (Low / Medium / High / Critical)
- status (Todo / In Progress / Done / Blocked)
- owner (Me / Team member)
- deadline (date-time)
- source (meeting / manual / imported)
- tags (bug / enhancement / project)

---

### 4. Carry Over System

If task is not completed:

- Automatically move to next day

👉 Mark as:

- "Overdue"
- "Carry-over"

---

### 5. Tomorrow Planner (Auto Suggestion)

At end of day:

- Suggest tasks for tomorrow based on:
  - priority
  - deadline
  - unfinished tasks

---

### 6. Team Assignment View

Show:

- Tasks assigned to each team member
- Status per member

👉 Example:
Sokleang:

- Fix schedule issue (In Progress)

Kimhong:

- PPWSA integration (Todo)

---

### 7. Deadline Reminder System

Highlight:

- Tasks due today
- Tasks overdue
- Tasks due within 24 hours

👉 Visual:

- Red = overdue
- Orange = due soon

---

### 8. Daily Focus Mode

Show only:

- Top 3–5 tasks for today

Hide everything else

---

## 🧩 Pages / UI Structure

### 1. Dashboard (Main Page)

- Daily timeline
- Task list
- Priority highlights

### 2. Tasks Page

- All tasks (filterable)
- Search
- Tags

### 3. Team Page

- Tasks grouped by owner

### 4. Planner Page

- Tomorrow suggestions

---

## 🎨 UI Requirements

- Use shadcn/ui components
- Clean, minimal, productivity-focused
- Keyboard shortcuts (optional)
- Dark mode support

---

## ⚙️ Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS
- shadcn/ui

---

## 🔌 API Requirements

### Task APIs

- Create task
- Update task
- Delete task
- Get tasks by date
- Get overdue tasks

### Notes APIs

- Create note
- Convert note → tasks

---

## 🧠 Optional AI Features (Phase 2)

- Extract tasks from meeting notes
- Suggest priorities
- Auto assign tasks based on history

---

## 🚀 MVP Scope

Focus only:

- Task CRUD
- Daily view
- Carry-over logic
- Deadline highlighting

---

## 🧪 Example User Flow

1. User enters note:
   "Fix home menu reorder and demo pilot plan"

2. System converts to:
   - Fix home menu reorder
   - Demo pilot plan

3. User assigns:
   - Task 1 → Me
   - Task 2 → Team

4. End of day:
   - Task 1 not done → move to tomorrow

5. Dashboard next day:
   - Shows carry-over tasks

---

## 📌 Success Criteria

- User can see ALL work in one screen
- No need to re-read notes
- Tasks are always actionable
- No missed deadlines
