# Security

The current documented version is PACE 0.3.0. There is no guaranteed maintenance window or response deadline.

## Reporting

Do not put vulnerability details, personal information, credentials or application profiles in public issues. Use GitHub private vulnerability reporting if the repository offers it, or an established private contact with the repository owner. If neither route is available, ask for a private reporting route in a sanitized issue without exploit details.

Include the affected version, operating system, reproduction steps and impact. Use synthetic examples and redact local paths that identify people.

## Boundaries

PACE has no authentication or application backend. Progress is stored locally and is not encrypted by the application. Device access and operating-system profile security matter.

Electron uses sandboxing, context isolation and disabled renderer Node integration. Do not weaken these boundaries to solve a renderer problem. Keep dependencies updated and review changes to URL handling or native privileges carefully.

CSV exports contain synthetic learning data. The optional browser-tool integration exposes read-only learning information when supported; it does not connect to an AI API.
