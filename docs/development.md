# Development

## Setup

Install Node.js 22.12+ and npm, then run npm ci in the repository root. Start the web workspace with npm run dev or the native Windows application with npm run desktop.

Content is separate from rendering. Prefer existing components and dependencies. Do not introduce a backend, authentication or an AI API as incidental refactoring.

## Checks

| Command | What it verifies |
| --- | --- |
| npm test | Learning calculations, mastery/review rules and persistence serialization |
| npm run build | TypeScript and production renderer bundle |
| npm run test:browser | Desktop interaction smoke check |
| npm run desktop:package | Windows x64 portable packaging |

Install the browser once with npx playwright install chromium. The Playwright configuration starts Vite automatically if no existing server is available on port 5173. The existing smoke test covers desktop navigation, calculation feedback, review, local commands and CSV export.

To use installed Chrome instead, set PLAYWRIGHT_CHANNEL=chrome in your shell before npm run test:browser. In PowerShell:

    $env:PLAYWRIGHT_CHANNEL = 'chrome'
    npm run test:browser

Browser checks do not validate native Electron window behavior. For desktop-host changes, launch the packaged executable, exercise keyboard navigation and CSV export, answer a question, close the app and reopen it to verify persistence.

## Visual review

Use desktop widths around 1440px and ordinary laptop widths. Inspect logo sizing, active navigation, visible focus, table alignment, overflow and modal behavior. Keep screenshot fixtures free of personal information. Mobile work is outside the product scope.

## Automation

GitHub checks install dependencies, run learning tests and build the renderer. They do not publish releases, upload personal progress or prove desktop packaging works. Electron binary download is skipped for this renderer-only job.

## Restricted local environments

The optional build-portable.ps1 and vite.portable.mjs are retained for environments with unusual process-launch restrictions. The normal npm workflow is preferred. Do not infer a successful desktop build from a renderer-only build.

