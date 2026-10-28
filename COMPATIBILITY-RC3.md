# RC3 compatibility investigation (in progress)

Upstream: https://github.com/YuJunZhiXue/dsh-purge
Baseline: commit `160b9114cbad7beca3d4d3f9f027ec843bf46f5e`, tag `v1.1.81`.
Source: cloned from the upstream repository on 2026-10-28. Keep the upstream LICENSE and NOTICE.

The supplied offline archive reports the same version, with bundled red-team skill documents and no postinstall. Its main code matches the upstream baseline; its packaging differs. The offline archive and its supplementary documents are not included in this public repository.

The upstream README explicitly says rc.3 is unsupported. On the investigated macOS installation, both the desktop host and the dsh-base package report 0.2.1-rc.3. This branch is experimental and does not claim rc.3 support.

A file-only experiment against a separately extracted copy of that installation reported 60 changed patches, six already matched, and 16 missing or skipped. Reverting restored every one of the 56 inspected target files byte-for-byte. This experiment does not prove any application UI, runtime behavior, permission policy, or end-to-end compatibility.

Changes here:
- Avoid writing pnpm build approvals for a bundle that contains no postinstall. The supplied offline bundle has no postinstall; automatically adding URL-based approvals on startup risks breaking the profile. Bundles that do contain a postinstall retain upstream behavior.
- Replace a fresh profile’s empty YAML list before inserting the plugin. The upstream and supplied registration implementations otherwise append entries after `[]`, producing invalid YAML and stopping desktop startup.
- Ignore hidden metadata files when installing bundled Markdown skills. macOS archive creation can otherwise turn AppleDouble files into apparent skills.
- Add an offline registration command that uses the corrected profile insertion logic and does not alter pnpm build approvals.

The official desktop contains a sealed app.asar; do not run patch application against an active installation during this investigation. Existing profiles, credentials, conversations and host files must not be copied into public artifacts.
