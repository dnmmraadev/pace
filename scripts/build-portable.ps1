$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
node node_modules/typescript/bin/tsc -b
if ($LASTEXITCODE -ne 0) { throw 'TypeScript verification failed.' }
node node_modules/typescript/bin/tsc --project tsconfig.tools.json --noEmit
if ($LASTEXITCODE -ne 0) { throw 'Test and configuration type verification failed.' }
New-Item -ItemType Directory -Force .sites-runtime/staging | Out-Null
& './node_modules/@esbuild/win32-x64/esbuild.exe' src/main.tsx --bundle --minify --format=esm '--external:/brand/*' --outfile=.sites-runtime/staging/app.js
if ($LASTEXITCODE -ne 0) { throw 'Application bundling failed.' }
$siteHtml = Get-Content -Raw index.html
$siteHtml = $siteHtml.Replace('<script type="module" src="/src/main.tsx"></script>', '<link rel="stylesheet" href="./app.css"/><script type="module" src="./app.js"></script>')
Set-Content -LiteralPath .sites-runtime/staging/index.html -Value $siteHtml
node node_modules/vite/bin/vite.js build --config scripts/vite.portable.mjs --configLoader native
if ($LASTEXITCODE -ne 0) { throw 'Vite packaging failed.' }
