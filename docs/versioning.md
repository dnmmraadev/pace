# Versioning and releases

## Current source version: 0.3.0

PACE uses [Semantic Versioning 2.0.0](https://semver.org/) and publishes plain MAJOR.MINOR.PATCH version numbers. The current source version is **0.3.0**, a feature release prepared locally. The latest published GitHub release remains **0.2.0**; 0.3.0 is not automatically tagged or published by packaging.

0.3.0 retains the White Gold visual system and local-first browser/Electron delivery while adding variable practice, concept evidence, interviews, analyst assignments and transfer. Saved-progress schema version 1 and its storage key remain unchanged: optional metadata is additive and legacy completion/history/capstone remain usable. Assessment semantics deliberately change: historical fixed answers no longer confer proficiency, which now requires distinct generated instances. This is explained to learners; no destructive data migration is required. The leading zero continues to indicate initial development.

## Compatibility contract

PACE's compatibility surface consists of persisted progress schema and identifiers, documented command behavior, documented CSV export columns and meanings, and supported desktop launch/packaging behavior. There is no external service API.

During 0.x development:

- Use a new minor version for feature additions or breaking compatibility changes, with explicit migration notes for saved progress or CSV consumers.
- Use patch revisions for compatible fixes.
- Publish releases as plain versions such as 0.2.0, 0.2.1 and 0.3.0, without prerelease suffixes.

After 1.0.0, incompatible contract changes increment MAJOR, compatible feature additions increment MINOR, and compatible fixes increment PATCH. Dates describe release timing, not the version number.

Before 1.0.0, define the supported Windows environments, validate core and advanced learning flows with representative users, establish saved-progress migration expectations, and resolve release-blocking issues.

## Release procedure

1. Update package.json, package-lock.json, changelog, supported-version documentation and download links together.
2. Run focused learning tests and the production build; verify desktop interaction if relevant.
3. Build the Windows executable from the intended release source and smoke-test the packaged application. Generated packages go to ../builds/<version>/package; retain published assets separately in ../releases/<version>.
4. Record SHA-256 for the final executable. Checksums detect download corruption; they do not replace code signing.
5. Commit and push the release source, confirm GitHub checks pass, then create an annotated v-prefixed tag on that commit.
6. Publish reviewed release notes and executable/checksum assets as a regular release, not a GitHub pre-release.
7. Verify repository visibility, tag commit, asset sizes and uploaded hashes.

Published contents and artifacts are immutable: corrections receive a new version. Do not silently overwrite a released executable or move its tag. Production packaging has automatic publishing disabled; release publication is explicit.

## Historical versions

The original published versions 0.1.0-beta.1 and 0.2.0-beta.1 remain unchanged in the release history and local archive. The earlier 1.0.0 package value was an unpublished development placeholder. Current and future publications follow the plain-version policy above.

See [GitHub's release documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository). Repository visibility does not select a source or brand license; the existing rights notice remains applicable.
