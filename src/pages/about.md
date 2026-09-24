---
layout: ../layouts/Page.astro
title: About
description: I'm Koji Wakamiya, koji-1009 on GitHub. I build Flutter and Dart tools, and contribute to Flutter itself.
---

## Contributions to Flutter

As of September 2026, 23 of my pull requests have been merged into [flutter/flutter](https://github.com/flutter/flutter/pulls?q=is%3Apr+author%3Akoji-1009+is%3Amerged), 6 into [flutter/packages](https://github.com/flutter/packages/pulls?q=is%3Apr+author%3Akoji-1009+is%3Amerged) and 3 into [flutter/website](https://github.com/flutter/website/pulls?q=is%3Apr+author%3Akoji-1009+is%3Amerged). Several of them have been featured in Notable Commits, the lists of highlighted changes that the Flutter team publishes ([2024](https://github.com/flutter/flutter/issues/121415), [2025](https://github.com/flutter/flutter/issues/161460), [2026](https://github.com/flutter/flutter/issues/181433)).

### Font fallback on iOS

Japanese text on iOS did not follow the requested font weight: font fallback in the Skia text stack always returned the weight-400 face of Hiragino Sans. I logged what the fallback returned for each requested weight and proposed a wrapper that picks the face of the requested weight, as a fix for [#132475](https://github.com/flutter/flutter/issues/132475) in [#179350](https://github.com/flutter/flutter/pull/179350). It was not merged.

### Text input on the web

- [#180436](https://github.com/flutter/flutter/pull/180436) Fix IME and selection by syncing more text styles
- [#161593](https://github.com/flutter/flutter/pull/161593) Fix composing offsets when typing Japanese text
- [#166212](https://github.com/flutter/flutter/pull/166212) Fix the fallback font loading process

### Keyboard and autofill on iOS

- [#182661](https://github.com/flutter/flutter/pull/182661) Fix keyboard flicker when switching text fields
- [#173598](https://github.com/flutter/flutter/pull/173598) Fix autofill context cleanup and view lifecycle management
- [#165637](https://github.com/flutter/flutter/pull/165637) Infer the autocorrect value from `autofillHints`

### Images and memory

- [#184549](https://github.com/flutter/flutter/pull/184549) Add `useLogicalPixels` to `ResizeImage`
- [#180327](https://github.com/flutter/flutter/pull/180327) Add `reportErrors` to `ImageStreamListener`
- [#159945](https://github.com/flutter/flutter/pull/159945) Dispose the codec after frame creation, followed by the same fix across the framework, engine and tests

### Widgets and packages

- [#180411](https://github.com/flutter/flutter/pull/180411) Add `scrollCacheExtent` to `PageView`
- [#152972](https://github.com/flutter/flutter/pull/152972) Remove the destination limit in `NavigationRail`
- [flutter/packages#9458](https://github.com/flutter/packages/pull/9458) Support extension types in `go_router_builder`

## Open source

- [shutter](https://github.com/koji-1009/shutter): renders a project's widget previews to PNG and diffs two runs into before-and-after images
- [setup-flutter](https://github.com/koji-1009/setup-flutter): sets up the Flutter SDK in GitHub Actions
- [paging_view](https://github.com/koji-1009/paging_view): paged lists, in the spirit of Android Jetpack's Paging 3
- [platform_image_converter](https://github.com/koji-1009/platform_image_converter): image format conversion using native APIs on iOS, macOS, Android and the web
- [dartrics](https://github.com/koji-1009/dartrics): code-quality metrics and unused public API detection for Dart
- [flutter_auth_ui](https://github.com/koji-1009/flutter_auth_ui): Firebase Auth UI for Flutter (unofficial)

## Elsewhere

[GitHub](https://github.com/koji-1009) · [X (@D_R_1009)](https://x.com/D_R_1009) · [Zenn](https://zenn.dev/koji_1009) (Japanese) · [blog.dr1009.com](https://blog.dr1009.com/) (Japanese)
