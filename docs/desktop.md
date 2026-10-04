# Windows desktop application

## Launch and package

From the repository root:

    npm ci
    npm run desktop

For a distributable Windows x64 portable build:

    npm run desktop:package

Output is placed in ../builds/<package-version>/package, outside the source tree. For the current version, the portable launcher is ../builds/0.2.0/package/PACE-0.2.0-Windows.exe. The packaging process also leaves a win-unpacked application directory. Do not commit generated executables.

In the organized local PACE workspace, source/ is the active Git checkout; releases/<version>/ contains retained published executables and checksums; builds/<version>/ contains generated packages, verification screenshots and isolated QA profiles; archive/ retains unpublished builds and historical work. Copy verified publication assets into a new releases/<version>/ directory. Do not overwrite existing published assets. The root README identifies the current executable.

The application loads its bundled renderer without a running Vite server. Packaging is configured with publishing disabled. This repository does not provide automatic release publishing.

## Progress

Electron stores its profile under the Windows application-data directory, normally %APPDATA%\PACE. Learning progress is localStorage within that profile. Moving the portable executable does not move or erase the existing profile.

Browser learning progress and desktop learning progress are separate. There is no automatic transfer, account synchronization or cloud backup. Do not commit or share an application profile as a bug attachment.

## Keyboard use

Ctrl/Cmd + K opens search. The command composer supports the local commands listed in the README. Standard focus navigation and Escape for overlays remain available. Native menu behavior follows Electron and Windows conventions.

## Troubleshooting

- **Missing Electron binary:** npm ci must allow the Electron installation script and network download. Reinstall dependencies with normal installation scripts enabled.
- **Blank packaged window:** rebuild the renderer and package again; inspect local diagnostics without sharing personal progress.
- **Port conflict during browser checks:** close the conflicting server or confirm that the existing port 5173 server is this application.
- **Windows reputation prompt:** local builds are unsigned. Code signing and a signing service are not configured.
- **Progress appears missing:** confirm whether you opened the browser workspace or desktop workspace; each has its own origin and profile.

Windows x64 is the verified packaging target. This documentation does not claim macOS or Linux packaged support.

