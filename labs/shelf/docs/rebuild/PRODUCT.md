# Shelf product direction

Shelf is a personal environment made of useful apps working with shared objects. Its default experience should let a person capture what is on their mind and start working immediately. Customization becomes available as their needs grow.

The user has chosen a fresh implementation built block by block. The overall visual language can remain familiar, while the architecture becomes modular and replaceable.

## The lesson from the existing app

The user tried several personal management tools with a simple goal: enter the things they need to do today and begin working. The interaction they valued was direct: open Today, type a task, press Enter, and continue typing in the next row, with a calendar visible beside the list.

This is a product criterion for every app: its screen should make its purpose and next action apparent. Configuring types, databases, relationships, or dashboards must not be required to accomplish a basic task.

The present sidebar improved clarity through compact collapsible cards. However, the sidebar should become a selected view of the user's information, rather than the place where every object must appear. The full collection remains available through the relevant app and search.

## Vocabulary

| Concept | Meaning |
| --- | --- |
| Object | A particular task, note, recipe, book, review, or other stored thing with a stable identity. |
| Type | A definition of an object's properties and meaning. Task is a type; a task is an object. |
| View | A live selection of objects, with filtering, sorting, grouping, and presentation such as list, grid, board, masonry, or calendar. |
| Page | A destination supplied by an app. It can combine views, content, actions, insights, and specialized interactions. |
| Widget | A compact app contribution placed in the sidebar, Home, or another compatible page. Each instance can have its own configuration. |
| App | A capability organized around a purpose, with types it registers or reuses, pages, views, behavior, actions, integrations, and widgets. |
| Shelf | The host environment that stores the user's objects and provides common services and app composition. |

An app can work with many types. Multiple apps can work with the same type. A page is not required to be a separate app: a Tasks app might provide Today, Upcoming, and All tasks, while a Daily Planning app provides an alternative Today workflow.

## Apps and the sidebar

The proposed sidebar structure is:

1. Fixed Shelf logo/Home, Search, and Capture controls.
2. Pinned page shortcuts, initially including useful defaults such as Today, Inbox, and Calendar.
3. Configurable, collapsible widgets.
4. Collapsible Recents.

The logo opens Home. Home provides an overview and a reliable Apps section where installed apps can be found and opened. App management is also available through Settings. A person should be able to choose Home or an app-provided page as their startup destination.

Installing an app does not require giving it sidebar space. A shortcut opens an app page; a widget exposes selected content or actions. Removing a shortcut or widget preserves its objects. More than one widget instance from the same app is allowed, such as Work notebooks and Personal notebooks.

Widgets can show explicitly selected objects, a live selection such as active projects, or pinned objects followed by a live selection. Apps supply useful defaults. Users can adjust the selection from the owning app or the widget's settings without learning a query language.

The previous v0.15 decision to remove History from navigation remains a historical baseline. The new direction explicitly introduces compact Recents; this is not a requirement to reinstate the old full History destination.

## Purposeful pages

An app page can include a database view and also offer insights, progress, editorial content, and actions. A Notes app might show recent writing, selected notebooks, and All notes. A Book Reviews app might show the current book, review drafts, a reading streak, and a review database.

The primary activity should determine the page layout. A dashboard is useful when it helps that activity; counts and statistics should not push the primary action out of reach. Preserve specialized experiences such as continuous task entry and calendar dragging instead of forcing every page into the same generic grid.

## Shared objects in practice

Notes may register Note and Notebook. Projects can display Projects plus linked Tasks, Notes, and Resources. Book Reviews can introduce Review and reuse a Book type. A Recipes app can create a shopping task that appears in a Tasks app and Today. It remains the same object, so completing it in one place updates the others.

Different task apps may offer different workflows using the same task objects. Their interpretation of a daily plan may vary. Shared meanings such as an explicit deadline or completion must remain compatible; app-specific planning state belongs to the relevant workflow.

## Capture

Apps can teach Shelf to recognize content and propose a type or action. Shelf applies a predictable precedence: an explicit user choice first, then an explicit capture context, then recognition of the content. Opening capture from a notebook already establishes a destination. Pasting a recipe into global capture may suggest Recipe.

The suggested type and destination remain visible and easy to change. Ambiguous text should be savable without a classification chore. Installing more apps must not make ordinary capture confusing or silently redirect an explicit choice.

## Defaults and extensibility

Shelf ships with useful apps that work immediately. Advanced users can customize properties, views, widgets, layouts, and rules. Specialized interactions and integrations may require additional programming; configuration and app development are different levels of participation.

A future app catalog can distribute official and community apps. User-authored apps and richer integrations are future possibilities. The first delivery should prove the app boundaries with a few bundled apps before building an ecosystem.

All product UI is in English. Continue the calm visual approach established in v0.15: clear grouping, light task rows, restrained controls, and direct input. Visual details in the legacy reference are useful defaults, not a mandate to reproduce every screen unchanged.
