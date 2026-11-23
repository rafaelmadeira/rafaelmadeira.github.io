# Shelf rebuild decisions

Recorded: 2026-11-23. These decisions capture the user's architectural direction and the distinctions discussed in the originating chat. They supersede v0.15's hardcoded architecture for the rebuild. They do not retroactively change the legacy application's behavior.

## Established direction

| Decision | Consequence |
| --- | --- |
| Start from a fresh foundation and build block by block. | Develop a separate implementation and deliver small useful increments. |
| Objects are the base unit, with properties and types. | Object identity and content survive different presentations. |
| Apps provide capabilities beyond type databases. | An app can offer behavior, insights, integrations, pages, and widgets. |
| Sidebar content is customizable. | A widget exposes selected/live content; it is not the complete inventory of a type. |
| Home provides an overview and a home for installed apps. | The Shelf logo opens Home; Apps management is accessible from Home and/or Settings. |
| Sidebar structure becomes logo controls, main shortcuts, widgets, and Recents. | Separate page pins from widget instances. |
| Today, Inbox, Calendar, Archive, and Trash can be app-provided experiences. | Do not hardcode their screens into the shell. |
| Alternative apps can offer different Today workflows. | Pins identify the providing app/page, not just the label Today. |
| Apps should be replaceable and independently maintainable. | Use contribution boundaries and versioning; deployment can remain shared. |
| Apps share and act on the same objects. | Do not build isolated app databases that require copying/synchronizing common records. |
| Defaults must be useful immediately. | Configuring the system is optional, not an onboarding requirement. |
| English product UI. | Labels, actions, settings, and empty states remain in English. |

## Architectural refinements to carry forward

These explain the direction rather than adding separate user-facing features:

- An app may register multiple types or reuse existing ones. Multiple apps may work with the same type.
- A page may belong to a larger app or a dedicated app. Do not force a one-to-one relationship between sidebar destinations, types, and apps.
- Built-in means supplied with Shelf. System-level invariants such as lifecycle filtering are separate from an app's replaceable interface.
- Shared task contracts define stable meanings; workflow opinions such as daily rollover can be app-specific.
- Object data and readable type information persist independently of app installation. Deleting data is explicit.
- Capture prioritizes explicit choice and explicit context before inferred recognition.
- Configuration and app development are different levels of extensibility. Generic building blocks need not pretend to implement every specialized interaction.

## Proposed build choices

The roadmap is a recommended sequence, not a frozen implementation specification. These choices should be resolved at the relevant block and recorded here:

| Choice | Current proposal or constraint |
| --- | --- |
| Rebuild folder and release name | Use `labs/shelf/next/` as an isolated development folder. Final release naming remains open. |
| Framework and language | Open. Choose the smallest maintainable setup for modular contributions and the existing static hosting. |
| Persistence engine | Open. A separate namespace and reliable reload behavior are required. |
| App declaration/API format | Open. Begin with bundled modules and stable app/page/widget IDs; formalize through real use. |
| First functional app | Notes is the proposed first vertical slice. |
| Second app | Choose a small app that reuses Note objects to prove shared data and replaceability. |
| Tasks and Today packaging | Could be pages of one app or separate cooperating apps. Do not decide from the sidebar label alone. |
| Generic object fallback | Needed for access without a specialized renderer; exact UI can be small initially. |
| Home layout and default pins | Open within the established navigation model. |
| Capture fallback and conflict UI | Open; ambiguity must not create friction or silently override explicit choices. |
| Existing data import | A later deliberate migration; do not write to v0.15 storage from the new foundation. |
| App catalog, user-authored apps, richer integrations | Future direction, outside the initial build blocks. |

## Avoid these regressions

Do not turn app installation or schema design into a prerequisite for writing the first task or note. Do not treat a hidden sidebar item as deleted data. Do not treat every type as a separate app, or every app as a separate database. Do not put opinionated Today logic into the host just because Today ships by default. Do not attempt the entire ecosystem before demonstrating two apps over shared objects.

## Updating decisions

When a choice is resolved, record the decision, its scope, reason, and affected build block. Mark a changed decision as superseded and update the related documents. Preserve the distinction between a user requirement, a chosen implementation detail, and a future possibility.
