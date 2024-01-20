<p align="center">
  <a href="https://bodypace.org" target="_blank">
    <img src="https://bodypace.org/favicon.ico" width="75"/>
  </a>
</p>

<p align="center">
  <a href="https://github.com/Bodypace/bodypace-mobile-app/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/bodypace/bodypace-mobile-app" alt="Package License" /></a>
  <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/t/bodypace/bodypace-mobile-app">
  <img alt="GitHub package.json version (branch)" src="https://img.shields.io/github/package-json/v/bodypace/bodypace-mobile-app/main">
  <img alt="" src="https://img.shields.io/badge/tests-missing-orange" />
  <img alt="" src="https://img.shields.io/badge/status-not%20useful%20yet%20(under%20development)-yellow" />
</p>

# Bodypace mobile app

General information about this app is on https://bodypace.org and https://github.com/Bodypace.<br/>

This app is built with [Expo](https://expo.dev/).

Current development setup is simple, there are two apps:

- `Bodypace (Dev)` - development client for developers to see code changes in real time
- `Bodypace` - production build that is first tested for few days/week and then released in Google Play

Although app is created in Expo and could be build for iOS without any troubles, for now only Android builds are being released ([@robert-dorna](https://github.com/robert-dorna): I don't Apple Developer ID to release iOS version).

## how to run it locally for development

### requiremnets

- Smartphone (iOS or Android) or (not described below) Simulator (MacOS XCode) or Emulator (Android Studio)
- Computer (with `git`, `npm` and `node` installed)

### steps

1. install and run development server (in terminal)

```bash
git clone https://github.com/Bodypace/Mobile
cd Mobile
npm install
npm start
```

2. install and use [Expo Go](https://expo.dev/client)

- on your phone install app called "Expo Go" (search in your apps store)
- run this app
- scan QR code that you see in your computer terminal

> Note: phone and computer must be in the same local network (e.g. same wifi)

> Note 2: this is a short guide for those who are not familiar with Expo. There are more possibilities like using Emulator/Simulator instead of your actual phone etc. See [Expo docs](https://docs.expo.dev/) for details.

---

## Future: DevOps (CI/CD) description & Where to point Pull Requests

> Note:
>
> This is planned for future and in 0% implemented as of now, could change or not be done at all.
>
> Also, those are notes and it is more of a scratch pad than a finished document while are reading it keep in mind that some parts may make no sense, be incorrect, or be unfinished.

Bodypace mobile app uses Git branches, Git tags, GitHub Actions, and Expo EAS to implement as smooth and automated CI/CD pipeline as possible.

Bodypace mobile app uses OTA (Over-The-Air) updates to publish patches to the end users and Application Store to publish major and minor releases to

---

## Overview

##### Application build names, Expo EAS services and Git branches

| Application Name        | EAS Profile | EAS Channel      | EAS Branch (EAS Updates) | git branch   |
| :---------------------- | :---------- | :--------------- | :----------------------- | :----------- |
| Bodypace (Dev)          | development | development      | development              | <none>       |
| Bodypace (Latest)       | latest      | latest           | latest                   | latest       |
| Bodypace (Pre-Patched)  | patches     | patches          | patches                  | main         |
| Bodypace (Next Release) | preview     | preview          | next-release             | next-release |
| Bodypace                | production  | prod-MAJOR.MINOR | prod-MAJOR.MINOR         | production   |

##### Git branches and their flow

**`main`** is being **rebased** on top of **`next-release`**
**`next-release`** is being **rebased** on top of **`next-patches`**
**`prod`** is being **fast forwarded** to **`next-patches`**

```markdown
## example showing one possible git commits history (with version tags, "-c" means "-candidate")

`br: next-release` `br: prod-1.0` `br: patches`
`C1 (1.0.0)` <-- `C2 (1.0.1)` <-- `C3 (1.0.2-c)` <--- `C5 (1.0.3-c)` <-- `C6 (1.0.4-c)` <-- `C8 (1.0.5-c)` <-- `C11 (1.0.6-c)`  
 ^  
 '-- `C4 (1.1.0-c)` <-- `C7 (1.1.1-c)` <-- `C9 (1.2.0-c)` <-- `C10 (1.2.1-c)`
`main`

# This example assumes that we did not rebase `main` on top of `patches` for a long time which we avoid, so this scenario is possible but not common.

# Below in this document you will find a more detailed example that shows step by step how PRs are merged,

# how branches diverge and are merged back together, and how new releases are automatically created and shared
```

##### All tags used

- Specified by Contributor in a PR:

  - release type (mutually exclusive, one is required):

    | tag name        | candidate version tag generated on merge | creates new build(s) | creates new EAS Update |
    | --------------- | ---------------------------------------- | -------------------- | ---------------------- |
    | `major-release` | major+1 . minor=0 . patch=0              | yes                  | yes                    |
    | `minor-release` | major . minor+1 . patch=0                | yes                  | yes                    |
    | `patch-release` | major . minor . patch+1                  | no                   | yes                    |
    | `empty-release` | major . minor . patch                    | no                   | no                     |

  - runtime changed (optional, acts as a boolean flag):

    | tag name          | cannot be specified without        | what it does                             |
    | ----------------- | ---------------------------------- | ---------------------------------------- |
    | `runtime-changed` | `major-release` or `minor-release` | builds all profiles, not only production |

- Automatically set by GitHub Actions:

  - candidate version tag:

    | tag name                          | what it does |
    | --------------------------------- | ------------ |
    | `ver-MAJOR.MINOR.PATCH-candidate` |              |
    | `ver-MAJOR.MINOR.PATCH`           |              |

---

## Entire flow example

```markdown
## At the beginning we have released version 1.0.0, with runtime 1.0. There are 4 builds of our app, and 4 PRs ready to merge.

## Note PRs get automatically generated EAS Updates in `development` EAS Branch, and the names of thoses EAS Updates say

## which version an EAS Update targets (for which version it is for).

`br: main`
`br: patches`
`br: next-release`
`br: prod-1.0`
`C1 (1.0.0)` (latest)
`rt: 1.0`
`  production-1.0.apk` (open to see it's 1.0.0)  
`next-release-1.0.apk` (open to see it's 1.0.0)
`     lastest-1.0.apk` (open to see it's 1.0.0)
`         dev-1.0.apk` (open to see it's 1.0.0)

                                     EAS Updates (branches):

Pull Requests: development | latest | next-release | prod-1.0  
`PR1 patch` PR 1.0.0: message (rt: 1.0) | C1 msg (rt: 1.0) | release 1.0.0 (rt: 1.0) | release 1.0.0 (rt: 1.0)
`PR2 patch` PR 1.0.0: message (rt: 1.0) |
`PR3 minor` PR 1.0.0: message (rt: 1.0) |
`PR4 minor rtc` (runtime changed) PR 1.0.0: message (rt: 1.0) |
C1 msg (rt: 1.0)

## When there are many PRs we first merge all empty-release, then all patch-release, then minor, and at the end major.

## If Contributor has a patch to current production version, it should be merged to `patches` branch.

## Otherwise (not a patch, or a patch to not `prod-MAJOR.MINOR` version), it should be merged to `main`.

## If `main` can fast forward to `patches`, it does so automatically.

## Branches `prod-MAJOR.MINOR` and `next-release` are controlled manually by Core Developers.

## Below we merged everything and got new 3 PRs. Tag runtime-changed does not influence merging, which leaves us with such git history.

`br: next-release`
`br: prod-1.0` `br: patches` `br: main`
`C1 (1.0.0)` <-- `C2 (1.0.1)` <-- `C3 (1.0.2)` <-- `C4 (1.1.0)` <-- `C5 (1.2.0)` (latest)
`rt: 1.0` `rt: 1.2`
`  production-1.0.apk` (open to see it's 1.0.0)  
`next-release-1.0.apk` (open to see it's 1.0.0)
`     lastest-1.0.apk` (open to see it's 1.1.0) `lastest-1.2.apk` (open to see it's 1.2.0)
`         dev-1.0.apk` (open to see it's 1.1.0) `    dev-1.2.apk` (open to see it's 1.2.0)

                                     EAS Updates (branches):

Pull Requests: development | latest | next-release | prod-1.0  
`PR1 patch` PR 1.0.0: message (rt: 1.0) | C5 msg (rt: 1.2) | release 1.0.0 (rt: 1.0) | release 1.0.0 (rt: 1.0)  
`PR2 patch` PR 1.0.1: message (rt: 1.0) | C4 msg (rt: 1.0) |
`PR3 minor` PR 1.1.0: message (rt: 1.0) | C3 msg (rt: 1.0) |
C5 msg (rt: 1.2) | C2 msg (rt: 1.0) |
C4 msg (rt: 1.2) | C1 msg (rt: 1.0) |
C3 msg (rt: 1.2) |
C2 msg (rt: 1.2) |
C1 msg (rt: 1.2) |

# As we can see above in `development` EAS Branch, EAS Updates for previous PRs were deleted and repleacements were generated using their now merged commits.

# From current PRs EAS Updates we can see that one patch targets C1, another patch targets C2, and minor update targets C4.

# All those PRs target old commits, and will not be accepted until they are updated to target latest `patches` or `main` commit.

## Lets assume PR2 was updated to target C3 (latest patch merged), and therefore was reviewed, accepted and merged as commit number C6.

                                             `br: patches`

`br: next-release` ,-- `C6 (1.0.3)` (latest)
`br: prod-1.0` v `br: main`
`C1 (1.0.0)` <-- `C2 (1.0.1)` <-- `C3 (1.0.2)` <-- `C4 (1.1.0)` <-- `C5 (1.2.0)` (latest)
`rt: 1.0` `rt: 1.2`
`  production-1.0.apk` (open to see it's 1.0.0)  
`next-release-1.0.apk` (open to see it's 1.0.0)
`     lastest-1.0.apk` (open to see it's 1.1.0) `lastest-1.2.apk` (open to see it's 1.2.0)
`         dev-1.0.apk` (open to see it's 1.1.0) `    dev-1.2.apk` (open to see it's 1.2.0)

                                     EAS Updates (branches):

Pull Requests: development | latest | next-release | prod-1.0  
`PR1 patch` PR 1.0.0: message (rt: 1.0) | C5 msg (rt: 1.2) | release 1.0.0 (rt: 1.0) | release 1.0.0 (rt: 1.0)  
`PR3 minor` PR 1.1.0: message (rt: 1.0) | C4 msg (rt: 1.0) |
C5 msg (rt: 1.2) | C3 msg (rt: 1.0) |
C4 msg (rt: 1.2) | C2 msg (rt: 1.0) |
C3 msg (rt: 1.2) | C1 msg (rt: 1.0) |
C2 msg (rt: 1.2) |
C1 msg (rt: 1.2) |

# Now we see that we have practically two separate branches with different latest commits.

# This is common, and such workflow was deliberately picked to allow for patches to always be OTA deliverable to current production release,

# no matter if we already merged some new minor/major releases or not (those we shouldn't deliver OTA, as Application Stores prefer to review them first).

# We can also see that now there is no EAS Update for C6 and that is a temporary flaw of this pipeline.

# When we rebase `main` on top of `patches`, all rebased commits will get their EAS Updates.

// `br: next-release` (after all automatic merges, Core Developer fast-forwarded from C1 to C3 skipping C2)
// `next-release-1.0.apk` (open to see it's 1.0.2-c)

## Below in this document you will find a more detailed example that shows step by step how PRs are merged,

## how branches diverge and are merged back together, and how new releases are automatically created and shared

`br: next-release` `br: prod-1.0` `br: next-patches`
`C1 (1.0.0)` <-- `C2 (1.0.1)` <-- `C3 (1.0.2-c)` <--- `C5 (1.0.3-c)` <-- `C6 (1.0.4-c)` <-- `C8 (1.0.5-c)` <-- `C11 (1.0.6-c)`  
 ^  
 '-- `C4 (1.1.0-c)` <-- `C7 (1.1.1-c)` <-- `C9 (1.2.0-c)` <-- `C10 (1.2.1-c)`
`main`
```

C1 update (b: prod-v1.0) (rt: 1.0) - v1.0: feat: release Bodypace mobile app
C1 update (b: preview) (rt: 1.0) - v1.0: feat: release Bodypace mobile app
C1 update (b: pull-request) (rt: 1.0) - v1.0: feat: release Bodypace mobile app

C1 build (c: prod-v1.0) (rt: 1.0) - Bodypace relase v1.0
C1 build (c: preview) (rt: 1.0) - Bodypace relase v1.0 (preview)
C1 build (c: dev) (rt: 1.0) - Bodypace relase v1.0 (dev)

c:dev <- b:pull-requests
c:preview <- b:preview
c:prod-v1.0 <- b:prod-v1.0

C1 - feat: release Bodypace mobile app - production v1.0.0 [main] [preview]

===== ===== =====

C3 update (b: prov-v1.1) (rt: 1.0) - v1.1.0: fix: use numeric keyboard for calories

C2 update (b: prov-v1.0) (rt: 1.0) - v1.0.1: fix: remove data blinking
C1 update (b: prod-v1.0) (rt: 1.0) - v1.0.0: feat: release Bodypace mobile app

C4 update (b: preview) (rt: 1.0) - feat: add clear button to products search bar
C3 update (b: preview) (rt: 1.0) - fix: use numeric keyboard for calories
C2 update (b: preview) (rt: 1.0) - fix: remove data blinking
C1 update (b: preview) (rt: 1.0) - feat: release Bodypace mobile app

C4 update (b: pull-request) (rt: 1.0) - v1.1.x: fix: add clear button to products search bar
C3 update (b: pull-request) (rt: 1.0) - v1.0.x: fix: use numeric keyboard for calories
C2 update (b: pull-request) (rt: 1.0) - v1.0.x: fix: remove data blinking
C1 update (b: pull-request) (rt: 1.0) - none: feat: release Bodypace mobile app

C3 build (c: prod-v1.1) (rt: 1.0) - Bodypace relase v1.1

C1 build (c: prod-v1.0) (rt: 1.0) - Bodypace relase v1.0
C1 build (c: preview) (rt: 1.0) - Bodypace relase v1.0 (preview)
C1 build (c: dev) (rt: 1.0) - Bodypace relase v1.0 (dev)

c:prod-v1.1 <- b:prod-v1.1
c:prod-v1.0 <- b:prod-v1.0
c:preview <- b:preview
c:dev <- b:pull-requests

C5 - feat: add clear button to products search bar - empty-release ver-1.1.1-1-candidate [preview] [main]
C4 - feat: add clear button to products search bar - [preview] [main]
C3 - fix: use numeric keyboard for calories - minor-release ver-1.1.0-candidate runtime-changed
C2 - fix: remove data blinking - patch-release ver-1.0.1-candidate
C1 - feat: release Bodypace mobile app - major-release ver-1.0.0

===== ===== =====

C5 - feat: place "Create New Product" button next to search bar -
C4 - fix: use numeric keyboard for calories -
C3 - feat: add clear button to products search bar -
C2 - fix: data blinking - ota-update v1.0.1
C1 - feat: release Bodypace mobile app - production v1.0.0 [main] [preview]
v1.1.0

Improvements:

- released Bodypace mobile app
  Bug fixes:
- ...
  Codebase quality (for developers):
- ...

====================================================

v1.0.1

Bug fixes:

- removed data blinking

====================================================

v1.0.0

Improvements:

- released Bodypace mobile app
