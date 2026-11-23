# Shelf rebuild sequence

Build one inspectable block at a time. The first milestone is a working host that loads app-provided pages; the following blocks prove shared objects, useful interactions, and replaceability before expanding the feature set.

The sequence below is proposed. The user can change it. It does not authorize an unattended implementation of the full roadmap in the next chat.

## Block 1 A shell with app pages

Inspect the repository and choose the smallest suitable technical setup for an isolated implementation. Record the folder, framework/language, local run command, and output location in the decision record. Keep the existing static website deployment in mind.

Implement a host that registers bundled app definitions, resolves stable page references, and renders navigation. Supply a simple Home app page with an Apps list and a second small demonstration page supplied through the same contract. The shell owns the layout and placement, while page content comes from the registered app.

Acceptance:

- The isolated app can be opened locally without modifying v0.15 files or storage.
- Clicking Shelf opens the Home app page.
- A registered page can be pinned and opened without a new app-specific branch in shell rendering.
- Removing a demonstration app's registration is handled gracefully by navigation.
- Product labels are in English, and basic navigation works with keyboard and pointer.

The demonstration page is temporary scaffolding, not a second finished product app. Avoid placeholder buttons that promise unimplemented actions without explanation.

## Block 2 Shared objects and persistence

Introduce stable identity, registered type definitions, properties, references, lifecycle state, a minimal query interface, and change notifications. Persist data in a namespace isolated from the legacy app. Provide a small generic way to inspect objects without a specialized app renderer.

Acceptance:

- Create, edit, query, and reload an object without changing its ID.
- Two consumers observe the same committed edit.
- Archived and trashed objects follow consistent visibility rules and can be restored.
- Data remains interpretable after its specialized app is unavailable.
- Invalid updates report failure without corrupting the stored state.

Choose persistence and migration mechanisms here, based on the requirements, rather than carrying over the monolithic v0.15 state object by default.

## Block 3 A useful Notes app

Register Note and, if needed for this slice, Notebook. Provide a page for creating, editing, and finding notes, a complete All notes view, and a direct primary action. Notes use the shared store. Add the minimum host search path needed to find them.

Acceptance:

- A user can write and retrieve a note immediately with no structural setup.
- Saved content survives reload and navigation.
- The same note is available through its app and generic object access.
- Note creation and editing do not require changes to the shell's rendering logic.

## Block 4 Configurable widgets

Implement widget definitions and independently configured widget instances. Notes supplies a sidebar widget using explicit selections and a simple live selection; allow more than one instance. Preserve collapse and placement preferences.

Acceptance:

- Work notebooks and Personal notebooks can be configured independently.
- Removing a note/notebook from a widget does not delete it or remove it from All notes/search.
- Changes to an object update every widget that shows it.
- Hiding or removing a widget preserves app data.
- Contextual creation uses an explicit destination.

Add richer filters, embedding placements, and widget types when a real app requires them.

## Block 5 Shared data and app replacement

Choose a second small app that reuses existing Note objects, such as a writing review or project reference page. Exercise enable/disable and replacement of app contributions. Retain readable definitions and a generic route to data.

Acceptance:

- Edit a note through the second app and observe the same ID and content in Notes.
- Disable one app and continue using its objects through another compatible view.
- Restore the app without duplicating objects or losing compatible configuration.
- Replacing the page contribution preserves data and handles pins explicitly.

This is the gate before expanding app management or claiming the architecture is meaningfully modular.

## Block 6 Tasks and an opinionated Today app

Define a compatible task contract and implement the user's proven daily workflow as an app-provided experience. Decide whether Today lives in Tasks or in a separate planning app. Keep deadline semantics independent of planning and calendar placement. Use the legacy reference for detailed interaction acceptance.

Acceptance:

- Type a task, press Enter, and immediately continue on a fresh row.
- Calendar stays visible alongside the working list.
- Unfinished working tasks carry forward in this particular Today experience.
- Due today and Overdue remain separate, hideable groups; completed items remain at the bottom.
- All-day and timed placement require deliberate scheduling.
- Editing, keyboard shortcuts, reordering, and calendar dragging retain the established behavior.
- An alternative registered page could offer a different Today workflow without changes to the shell.

## Later increments

Add app-provided Inbox, Calendar, Archive, and Trash interfaces, richer Home widgets, capture recognition, and specialized apps as individual increments. Build a deliberate legacy import with backup and validation before switching the user's working environment. App catalog, external integrations, user-authored apps, permissions for third-party code, and cloud services follow evidence from real usage.

## Delivery discipline

Each block should include a working demonstration, focused verification of its actual risks, updated decisions, and a next step. Verify visual interactions in a local browser with synthetic data. Do not test by editing or clearing the user's public app records.

When publishing is part of the selected block, use the existing website workflow, keep changes within Shelf, and verify the deployed result before calling it live. Developing a new app is not permission to replace the legacy URL or storage. An eventual switch is a deliberate delivery decision.
