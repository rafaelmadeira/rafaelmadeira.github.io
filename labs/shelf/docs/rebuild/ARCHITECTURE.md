# Shelf architecture boundaries

Status: architectural direction for the rebuild. Concrete APIs, persistence technology, framework, and module layout are not implemented or finalized. The shapes below describe responsibilities, not a frozen SDK.

Shelf hosts replaceable apps over shared objects. Apps contribute pages and behavior through a common interface. Object storage remains independent of the availability or version of an app's UI.

## Host responsibilities

The host needs a small set of common services: object and type storage, identity and references, queries and change notifications, app registration and lifecycle, navigation, widget placement, search, capture coordination, and consistent archive/trash semantics.

The shell renders navigation and mounts contributions. It should not contain task-specific Today rendering, a hardcoded list of app sections, or app-specific workflows. Home can itself be a bundled app page. The host needs a minimal recovery path for unavailable pages and apps so a broken preferred destination does not prevent navigation or access to data.

Shared lifecycle rules apply outside any one page. A trashed object must normally be excluded from search and active queries even if the Trash app is disabled. Archive and Trash apps provide ways to browse and act on that lifecycle through shared commands.

## App contributions

A bundled app definition should identify the app, its version and supported host contract, and the contributions it provides. The useful categories are:

- Type definitions and property definitions it introduces or depends on.
- Pages with stable identifiers and navigation metadata.
- Widget definitions and their supported placements.
- Actions that work on shared objects.
- Capture recognizers that return proposals to the host.
- App settings, workflow state, and versioned data migrations when needed.

Not every app needs every contribution. Apps can depend on existing types without declaring new ones. Installed/enabled state and per-user configuration should be distinct from code shipped in a deployment.

Initially these can be local modules bundled into one deployment. Separate apps do not require separate services, repositories, or remote code loading. A package format and community execution model can follow evidence from the first apps.

## Shared data and contracts

Objects need stable IDs, a type reference, properties, timestamps, lifecycle state, and relationships. Attachments and rich content must remain accessible independently of a particular app renderer. Exact storage representation is an implementation decision.

Type definitions must remain available to interpret existing records after an app is disabled or removed. A generic object viewer/search path should provide basic access when a specialized app is absent. Do not make an app uninstall erase its type definitions or records automatically.

Shared contracts identify semantic meaning as well as field shape. Two apps claiming compatibility with a task contract must agree on what completion and a deadline mean. An app's daily-plan selection can remain its own workflow state; the host should not enforce the v0.15 opinion that unfinished tasks carry forward for every possible Today experience.

App preferences and workflow state should be namespaced by app. Widget configurations belong to widget instances. Shared object properties must not silently acquire different meanings when the user changes apps. For core transactions, all interested views should observe the same committed change through the shared store rather than synchronizing private copies.

## Pages and navigation

A pinned shortcut refers to a stable app identifier and page identifier, with optional label and icon overrides. The label Today does not identify a unique hardcoded route. Two apps can offer pages labeled Today, and the user's pin selects which one opens.

The shell can set a preferred startup page and resolve shortcuts without knowing the app's internal workflow. If a contribution becomes unavailable, explain the unavailable destination and offer a way to select an installed alternative. Keep configuration recoverable so reinstalling an app can restore its prior setup where compatible.

## Views and widgets

A view describes which shared objects are selected and how they are presented. A type page that shows All notes is a query over shared objects, not a separate database holding another copy of each note. Views may select one or multiple types where the app supports that.

A widget instance has its own identity, originating app/widget definition, placement, selection, display settings, and expansion preference. A definition can be instantiated more than once. Manual selections store stable object references; live selections store a query or equivalent declarative configuration; hybrid selections deduplicate pinned and query results.

Changing a widget's selection changes visibility only. Lifecycle filters should apply consistently; dangling references must not crash rendering. Sidebar widgets and embedded widgets may have different capabilities and sizes even when supplied by the same app.

Widget actions must carry explicit context. Creating a note from a notebook widget sets that notebook destination. Generic capture must not inherit an unrelated page's context or an old global focus setting.

## Capture coordination

Apps return recognition candidates rather than independently writing objects from every text input. The host resolves explicit user choices and destination context before recognition proposals. Define deterministic handling of multiple candidates, visible correction, and a safe path for ambiguous text when implementing this block.

Keep the original captured content recoverable during classification. An app's recognition rule must not override an explicit type or destination. Contextual commands should reuse shared creation logic with explicit options rather than hidden global state.

## Replaceability and updates

Replacing an app UI should preserve shared objects and compatible configuration. App upgrades declare their version and any required transformations. Treat transformations as migrations with a clear source/target version, validation, and recoverability; do not silently reinterpret old properties.

Distinguish the following operations in the eventual UI:

| Operation | Intended meaning |
| --- | --- |
| Hide shortcut or widget | Remove a navigation placement; keep the app and objects. |
| Disable app | Stop its contributions; preserve data and configuration. |
| Uninstall app | Remove installation/contributions; preserve the user's objects and readable type information. |
| Reset preferences | Restore that app's presentation/workflow configuration; scope must be explicit. |
| Delete data | A separate explicit object/data operation, never an implied side effect of uninstall. |

An early acceptance test should disable or replace an app and open its objects through another compatible page. Shared IDs and properties must survive. This is more meaningful evidence of the architecture than merely placing app files in separate folders.

## Scope boundaries

Defer a public SDK, remote app store, arbitrary third-party code execution, cloud synchronization, accounts, and a visual app builder until the foundation has proven useful. Future third-party apps will require explicit access boundaries and a compatibility/update policy; those are not solved by the initial bundled-module architecture.

Keep the new persistence namespace separate from v0.15. A later import can map old records while preserving IDs, relationships, content, and date semantics, but no implicit migration should modify the live legacy store during foundation development.
