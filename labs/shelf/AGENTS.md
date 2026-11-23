# Shelf development instructions

The active direction is a fresh, modular rebuild of Shelf using shared objects and replaceable apps. Before starting rebuild work, read `docs/rebuild/README.md` and the documents linked there. They distinguish established requirements from open implementation choices and preserve the legacy reference.

Work in the canonical checkout at `D:\ChatGPT\shelf`. This directory is part of `rafaelmadeira/rafaelmadeira.github.io`; limit changes to `labs/shelf/`. Keep source, dependencies, output, and caches on D: where practical. Do not move or rename the existing project.

Build one agreed block at a time. The current documentation task does not implement the rebuild. The proposed initial block is an isolated shell with app-provided pages. Record stack and folder choices before adding infrastructure; the framework and final release name are open.

Preserve the working `v0.15` app and its browser data (`shelf-everyday-v015` and `shelf-v011-files`). Use isolated source and storage for the rebuild. Verify with local synthetic data, not by changing the user's public records. Do not rerun historical implementation scripts from the desktop project workspace.

Product UI is English. Keep basic capture and working interactions immediately usable. Sidebar widgets and page pins are configurable presentations of shared objects. Apps can share types and objects; removing a widget or uninstalling an app does not implicitly delete data. Opinionated Today workflows belong to apps; common data lifecycle semantics belong to shared services.

After each block, update the rebuild handoff, decisions, verification, and next step. When publishing is part of the block, use the existing site workflow and verify the deployed result before calling it live. Do not replace the legacy URL as an incidental side effect of the rebuild.
