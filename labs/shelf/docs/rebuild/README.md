# Shelf rebuild starting point

Updated: 2026-11-23. Status: direction documented; rebuild implementation has not started.

Shelf will be rebuilt from a fresh foundation as a shared environment for replaceable apps. Objects belong to the user's Shelf. Apps provide purposeful experiences, register or reuse types, and contribute pages, capture rules, actions, and configurable widgets. The user can start using the default apps immediately and customize them later.

This is the durable handoff for continuing development in a new chat. Read these files before implementing the rebuild; do not depend on access to earlier chat messages.

## Read in this order

1. [Product direction](PRODUCT.md): the problem, vocabulary, user experience, and examples.
2. [Architecture boundaries](ARCHITECTURE.md): responsibilities, app contributions, shared data, and lifecycle.
3. [Decisions and open choices](DECISIONS.md): what the user has established and what remains a proposal.
4. [Build sequence](ROADMAP.md): small delivery blocks and their acceptance criteria.
5. [Legacy reference](LEGACY.md): the working v0.15 baseline and interactions worth carrying forward.

The scoped instructions in [Shelf AGENTS.md](../../AGENTS.md) point contributors here. For conflicts, subsequent explicit user decisions take precedence. Within these documents, the decision record distinguishes requirements from proposed implementation details.

## Repository and locations

- Canonical checkout: `D:\ChatGPT\shelf`.
- Repository: `rafaelmadeira/rafaelmadeira.github.io`, a personal website repository. Limit changes to `labs/shelf/`.
- Desktop project workspace: `D:\Documents\ChatGPT\shelf`. This contains historical development notes and local verification helpers; it is not the canonical source checkout.
- Documentation: `labs/shelf/docs/rebuild/` in the canonical checkout.
- Working legacy app: `labs/shelf/v0.15/`.
- Public legacy app: https://rafaelmadeira.com/labs/shelf/v0.15/
- Verified legacy baseline: `45e8d3dfcbf22b3ff47d8cb1d33f5a8fc8f40af6`, assets `today-reorder-15-14`.
- Suggested isolated rebuild location: `labs/shelf/next/`. This is a proposed development location, not an agreed release name or an existing implementation.

The checkout is sparse and includes `labs/shelf`. Do not replace the site's root, routing, other applications, or earlier Shelf versions. Keep source, dependencies, output, and project caches on D: where practical. Before creating a separate project, confirm `D:\ChatGPT` exists; do not move or rename an existing project without explicit approval.

## Current handoff

The user's latest request is to save the direction in the project sources and prepare a new chat with reliable context. This documentation delivery does not implement the new app. The new chat should first read the documents and inspect the checkout, then give a concise acknowledgement of the direction and identify the first build block for the user's continuation.

The intended next development task is Block 1 in the roadmap: choose the smallest suitable technical setup, record that choice, and build an isolated shell that loads app-provided pages. Avoid treating the entire roadmap as one authorized implementation batch. The user explicitly wants to work block by block.

Do not restart work on the old v0.15 monolith as the foundation. Its source and interaction details are references. Preserve its data and public functionality while the rebuild develops separately.

## Maintaining context

At the end of each delivery, update this current handoff with the completed block, source location, verification, and next concrete step. Record new architectural decisions in DECISIONS.md, and update affected documents together. Clearly distinguish implemented behavior from planned behavior.

Keep the handoff concise and authoritative rather than appending a long chronological transcript. Store implementation history in commits. A later chat should be able to understand what to build and what to preserve by reading this directory alone.
