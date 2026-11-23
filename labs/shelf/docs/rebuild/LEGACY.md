# Shelf v0.15 reference

This is the working baseline as of 2026-11-23, preserved as a product and migration reference. Its implementation is a buildless HTML/CSS/JavaScript app. The rebuild starts from a new architecture; it does not need to carry over the monolithic implementation.

## Source and data

- Source: `D:\ChatGPT\shelf\labs\shelf\v0.15\` with `app.js`, `style.css`, and `index.html`.
- Verified commit: `45e8d3dfcbf22b3ff47d8cb1d33f5a8fc8f40af6`.
- Public URL: https://rafaelmadeira.com/labs/shelf/v0.15/
- Current asset marker: `today-reorder-15-14`.
- Browser localStorage key: `shelf-everyday-v015`.
- Attachment IndexedDB: `shelf-v011-files`.
- Both Pages deployment workflows succeeded for that baseline.

Preserve those records and attachment access. Do not clear browser storage, mutate public records for QA, or implicitly migrate old data into a new shape. Keep source edits and verification records for the rebuild separate.

## Today behavior the user values

Today is a working task list beside an hourly calendar. Enter saves an inline task and focuses a fresh input below. New tasks are unassigned and undated unless the user explicitly specifies otherwise. Existing titles edit in place.

Tasks have independent meanings in v0.15:

| Field | Meaning |
| --- | --- |
| `plannedDate` | Membership in the working list. Unfinished tasks with a date on or before today carry forward. |
| `todayAddedAt` | Default insertion order in that list. |
| `dueDate` | An explicit deadline. It is never invented by entering a task in Today. |
| `plannerDate`, `plannerTime`, `plannerEndTime` | Deliberate calendar placement. An untimed planner date means explicit all-day placement. |
| `completedAt` | Completion time used for today's Completed group. |

Due today and Overdue contain deadline tasks outside the working list, avoiding duplicates. Each group can be hidden, and that preference persists. Add to Today brings the same task into the working list while preserving its deadline. Working-list tasks may quietly display their explicit deadlines.

The all-day planner does not automatically collect ordinary tasks, overdue work, or deadline tasks. Calendar-created tasks receive working-list membership for their selected day. A past calendar slot does not roll forward, although its unfinished task can remain in the working list. Events use their existing date/time/end fields; preserved event fields on a converted task do not imply task calendar placement.

Completed is anchored at the bottom, collapsed by default. Tasks can be reopened. The workspace preserves drafts, focused fields, and independent pane scroll during unrelated updates. The current-time marker updates each minute and the workspace refreshes at midnight.

Task rows have no divider lines. The Add task row has a faint checkbox. Text inputs have no prominent focus outline. Escape blurs the focused new/existing task input without losing its text. Ctrl+Enter (also Cmd+Enter) opens the focused task's edit modal; a nonempty new draft is created once first. Empty drafts create nothing. IME composition and key repeats are guarded.

The task overflow menu offers Edit task. Its modal edits title, notes, deadline, and optional calendar placement with explicit Save/Cancel. The removed inline options pane should not be restored by accident.

Pointer dragging can reorder within Tasks, Due today, or Overdue, with an insertion line. The per-group order persists in `state.ui.todayTaskOrder`. Reordering does not move tasks between deadline groups or alter dates. Dragging into the calendar places the same task at a 15-minute boundary for 30 minutes; it does not duplicate the task. All-day placement is also an explicit drop. Escape, outside drops, pointer cancellation, and blur cancel dragging. Focused text fields retain normal text editing.

Time selectors offer 15-minute increments, preserving existing off-grid values as current options. End selectors allow 24:00, and a new 30-minute drop starts no later than 23:30. Changing a start time preserves duration.

## Navigation and capture reference

Only the Shelf brand row is fixed; it has Search and Capture icons. There is no main-pane global top bar. The remaining sidebar scrolls together. Section cards are compact and collapsible, with direct child icons aligned to section labels and grandchildren indented. Contextual + controls appear on hover/focus and remain reachable on touch.

The old sections are Starred, To do, Notes, Journal, Projects, Goals, Habits, Bookmarks, Resources, Types, and Tags. Settings controls their visibility. The rebuild replaces this hardcoded list with app contributions and user placements.

Old children expand uniformly within groups: areas to categories, notebooks to notes, journals to entries, projects/goals to linked tasks, and collections to resources. Short lists show everything; lists above 10 show 5 initially with Show more. Types and Tags show everything. Sidebar repaint preserves scroll and focus.

Root capture creates unassigned content. Contextual capture explicitly selects the appropriate type and destination. Category tasks set both area and category. Journal capture appends to the selected journal's entry for today. Uploads retain explicit contextual destinations. The app must not inherit an unrelated page or global focus as a creation destination.

## Object actions and conversion

Item overflow actions use anchored menus, including keyboard navigation and Escape focus restoration, rather than an actions modal. `Turn into…` converts a content object in place, preserving identity, links, tags, memberships, attachments, and relevant properties. Structural containers are excluded from the legacy conversion menu.

Unchanged rich text can round-trip through another type; edited plain text is respected on returning to Note. Resource URLs/files and routine checklists remain accessible after conversion. An eight-second Undo reverses the conversion while retaining subsequent edits. Treat this as a future rebuild capability to design around shared type contracts, not an instruction to implement every conversion in the foundation block.

## Existing verification and useful source references

Local helper scripts in `D:\Documents\ChatGPT\shelf` include `verify-today.cjs` and `verify-refinement.cjs`. They target legacy functions and are not the new app's test architecture. Previous implementation scripts in that folder are historical; do not rerun them.

Useful legacy functions include `todayTaskGroups`, `orderedTodayTasks`, `reorderTodayTask`, `todayTaskRow`, `addTodayTask`, `openTaskEditor`, `scheduleDroppedTask`, `renderToday`, and `renderWorkspace`. Inspect these when reproducing behavior; do not infer that their state shape is the new contract.

Verified behavior includes consecutive Enter creation, independent dates, day rollover, no automatic calendar clutter, editor Save/Cancel, keyboard shortcuts, dragging and rescheduling without duplicates, persisted reorder, anchored menus, type conversion, sidebar state preservation, and no console errors in the tested flows. QA records were created on localhost only.
