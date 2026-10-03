# Versioning and releases

## First public release: 0.1.0-beta.1

PACE follows [Semantic Versioning 2.0.0](https://semver.org/) with a documented application compatibility contract. The first public release is **0.1.0-beta.1**, published as a GitHub pre-release.

- **0**: initial development; stable compatibility is not yet promised.
- **1**: the first public feature baseline.
- **0**: no patch revision of that baseline.
- **beta.1**: the first usable public evaluation build.

The earlier package value 1.0.0 was an unpublished development placeholder, not a released stable version. No existing release or tag is being rewritten.

The core learning loop and Windows desktop packaging work. Advanced modules have initial content and the product has limited external validation. A stable 1.0 declaration would therefore be premature. Beta denotes the project's evaluation stage; SemVer itself does not prescribe a universal beta-readiness checklist.

## Compatibility contract

PACE's compatibility surface consists of persisted progress schema and identifiers, documented command behavior, documented CSV export columns and meanings, and supported desktop launch/packaging behavior. There is no external service API.

During 0.x development:
- Use a new minor baseline for feature additions or breaking compatibility changes, with explicit migration notes for saved progress or CSV consumers.
- Use patch revisions for compatible fixes.
- Increment beta identifiers for subsequent evaluation builds of the same baseline, for example 0.1.0-beta.2.
- Use rc only when a candidate has no known release-blocking issues and the intended compatibility contract is ready for validation.

After 1.0.0, incompatible contract changes increment MAJOR, compatible feature additions increment MINOR, and compatible fixes increment PATCH. Dates describe release timing, not the version number.

Before 1.0.0, define the supported Windows environments, validate core and advanced learning flows with representative users, establish saved-progress migration expectations, and resolve release-blocking issues. This is a release-readiness policy, not a promise of a completion date.

## Release procedure

1. Update package.json, package-lock.json, changelog, supported-version documentation and download links together.
2. Run focused learning tests and the production build; verify desktop interaction if relevant.
3. Build the Windows executable from the intended release source and smoke-test the packaged application.
4. Record SHA-256 for the final executable. Checksums detect download corruption; they do not replace code signing.
5. Commit and push the release source, confirm GitHub checks pass, then create an annotated v-prefixed tag on that commit.
6. Publish reviewed release notes and executable/checksum assets. Mark evaluation builds as pre-releases.
7. Verify repository visibility, tag commit, asset sizes and uploaded hashes.

Published version contents and artifacts are immutable: corrections receive a new version. Do not silently overwrite a released executable or move its tag. Production packaging is configured with automatic publishing disabled; release publication is explicit.

See [GitHub's release documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository). Making the repository public does not select a source or brand license; the existing rights notice remains applicable.

