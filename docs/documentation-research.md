# Documentation research

Reviewed on October 3, 2026. The goal was to adopt useful repository-documentation practices, not to copy another project's policies or assume popularity proves documentation quality.

| Primary source | Practice observed | Application to PACE |
| --- | --- | --- |
| [GitHub: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) | Explain purpose, value, setup, help and maintainers; link detailed material | Concise product README with quick start and relative guide links |
| [GitHub: Community profiles](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories) | Make contribution and community expectations discoverable | Contributor, conduct, security and issue-template files |
| [Electron Fiddle README](https://github.com/electron/fiddle/blob/main/README.md) | Show the product and separate contributor guidance | Real desktop screenshot and focused documentation index |
| [Electron Fiddle contributing guide](https://github.com/electron/fiddle/blob/main/CONTRIBUTING.md) | Give concrete development and build instructions | Document renderer checks separately from native packaging |
| [VS Code README](https://github.com/microsoft/vscode/blob/main/README.md) | Keep the entry point readable and link contribution/security resources | Short overview with deeper architecture and security guides |

## Decisions

PACE documents its local storage, synthetic datasets, mastery rules and qualitative-assessment limits alongside setup instructions. These are essential to understanding this learning product.

The repository includes structured bug, content-correction and enhancement templates, a pull-request checklist and a small build/test workflow. Checks are described by what they actually verify.

No license was copied from the examples. Reuse rights remain undecided. No download counter, certification claim, unverified platform badge, release link or support-response promise was invented. Documentation is original and tailored to the existing implementation.

