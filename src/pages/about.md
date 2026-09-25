---
layout: ../layouts/Page.astro
title: About
description: I'm Koji Wakamiya, koji-1009 on GitHub. I build apps for Android, iOS and the web with Flutter, contribute to the Flutter framework and engine, and maintain 24 packages on pub.dev.
---

## Contributions to Flutter

As of September 2026, 23 of my pull requests have been merged into [flutter/flutter](https://github.com/flutter/flutter/pulls?q=is%3Apr+author%3Akoji-1009+is%3Amerged), 6 into [flutter/packages](https://github.com/flutter/packages/pulls?q=is%3Apr+author%3Akoji-1009+is%3Amerged) and 3 into [flutter/website](https://github.com/flutter/website/pulls?q=is%3Apr+author%3Akoji-1009+is%3Amerged). Six of them have been featured in Notable Commits, the lists of highlighted changes that the Flutter team publishes ([2024](https://github.com/flutter/flutter/issues/121415), [2025](https://github.com/flutter/flutter/issues/161460), [2026](https://github.com/flutter/flutter/issues/181433)).

### Font fallback on iOS

Bold Japanese text on iOS was rendered at the regular weight, an issue open since 2023 ([#132475](https://github.com/flutter/flutter/issues/132475)). I traced it to font fallback in the Skia text stack, which always returned the weight-400 face of Hiragino Sans, confirmed that Chinese, Korean, Arabic and Hindi text had the same problem, and proposed a fix in the engine ([#179350](https://github.com/flutter/flutter/pull/179350)). That pull request brought in the Skia team, who fixed it [in Skia](https://skia.googlesource.com/skia/+/59c6cad539f7fe01a42bded543beb927546739d5); the fix rolled into Flutter nine days later, and I confirmed it on the master branch.

### Text input on the web

Typing Japanese on Flutter Web broke composition and selection in several ways. I fixed the composing offsets, synced more text styles to the DOM input so that the IME and selection line up, and fixed how fallback fonts are loaded ([#161593](https://github.com/flutter/flutter/pull/161593), [#180436](https://github.com/flutter/flutter/pull/180436), [#166212](https://github.com/flutter/flutter/pull/166212)).

### Keyboard and autofill on iOS

I fixed the keyboard flickering when focus moves between text fields, cleaned up autofill contexts along with the view lifecycle, and made autocorrect follow `autofillHints` ([#182661](https://github.com/flutter/flutter/pull/182661), [#173598](https://github.com/flutter/flutter/pull/173598), [#165637](https://github.com/flutter/flutter/pull/165637)).

### Images and memory

Image codecs are now disposed right after their frames are created, and I followed up with the same fix across the framework, the engine and the tests ([#159945](https://github.com/flutter/flutter/pull/159945)). I also added `useLogicalPixels` to `ResizeImage` and `reportErrors` to `ImageStreamListener` ([#184549](https://github.com/flutter/flutter/pull/184549), [#180327](https://github.com/flutter/flutter/pull/180327)).

### Other work

Smaller framework changes include `scrollCacheExtent` on `PageView`, lifting the destination limit in `NavigationRail`, and extension-type support in `go_router_builder` ([#180411](https://github.com/flutter/flutter/pull/180411), [#152972](https://github.com/flutter/flutter/pull/152972), [flutter/packages#9458](https://github.com/flutter/packages/pull/9458)).

## Contributions across the ecosystem

Outside Flutter itself, my larger contributions move widely used packages onto new platform APIs: `dart:js_interop` and `package:web` in place of `dart:html`, WebAssembly, and Swift Package Manager.

- [webcrypto.dart](https://github.com/google/webcrypto.dart): migrated to `dart:js_interop` and extended WebAssembly support ([#86](https://github.com/google/webcrypto.dart/pull/86), [#180](https://github.com/google/webcrypto.dart/pull/180), [#178](https://github.com/google/webcrypto.dart/pull/178))
- [plus_plugins](https://github.com/fluttercommunity/plus_plugins): migrated share_plus, battery_plus and sensors_plus to `package:web` and `dart:js_interop`, and added Swift Package Manager support to battery_plus ([#2709](https://github.com/fluttercommunity/plus_plugins/pull/2709), [#2720](https://github.com/fluttercommunity/plus_plugins/pull/2720), [#2697](https://github.com/fluttercommunity/plus_plugins/pull/2697), [#3154](https://github.com/fluttercommunity/plus_plugins/pull/3154))

## Packages I maintain

I publish 24 packages on pub.dev under the [koji-1009.com](https://pub.dev/publishers/koji-1009.com/packages) publisher, including:

### Maintained forks

- [flutter_secure_storage_x](https://pub.dev/packages/flutter_secure_storage_x): a fork of [flutter_secure_storage](https://github.com/juliansteenbakker/flutter_secure_storage) that keeps a minimal API for the common encrypted-storage cases so that it stays stable over the long term
- [carousel_slider_x](https://pub.dev/packages/carousel_slider_x): a fork of [carousel_slider](https://github.com/serenader2014/flutter_carousel_slider)

### Widgets and platform

- [paging_view](https://pub.dev/packages/paging_view): paged lists, in the spirit of Android Jetpack's Paging 3
- [viewfinder](https://pub.dev/packages/viewfinder): a photo viewer
- [platform_image_converter](https://pub.dev/packages/platform_image_converter): image format conversion using native APIs on iOS, macOS, Android and the web
- [qr_scanner_view](https://pub.dev/packages/qr_scanner_view): a live camera QR and barcode scanner
- [yomu](https://pub.dev/packages/yomu): a QR code and barcode reader in pure Dart, with no dependencies

### Tools

- [shutter](https://pub.dev/packages/shutter): renders a project's widget previews to PNG and diffs two runs into before-and-after images
- [dartrics](https://pub.dev/packages/dartrics): code-quality metrics and unused public API detection for Dart, with the same tool for Kotlin and Java ([ktrics](https://github.com/koji-1009/ktrics)) and Rust ([cargo-rustics](https://github.com/koji-1009/cargo-rustics))
- [dapper](https://pub.dev/packages/dapper): a Markdown and YAML formatter, inspired by Prettier
- [setup-flutter](https://github.com/koji-1009/setup-flutter): sets up the Flutter SDK in GitHub Actions

## Web

- [Crumple Zone Architecture](https://github.com/koji-1009/crumple-zone-architecture): an architecture for web applications that trusts the browser and is designed around failure modes; this blog is built on it
- [astronoha](https://astronoha.app.koji-1009.com/) ([source](https://github.com/koji-1009/astronoha)): searches Japanese parliamentary speeches from the Meiji era to today, in the Imperial Diet and the National Diet, through the National Diet Library APIs (Japanese UI)

## Community

- [FlutterKaigi 2023 conference app](https://github.com/FlutterKaigi/conference-app-2023): main contributor, 527 of its 770 commits

### Talks at FlutterKaigi (in Japanese)

- 2025: [An invitation to contribute to Flutter](https://speakerdeck.com/d_r_1009/flutterkontorihiyusiyonnosusume)
- 2022: [Replacing a popular service with Flutter Web](https://speakerdeck.com/d_r_1009/ren-qi-sabisuwoflutter-webderipuresusurutodounarunoka)
- 2021: [Bringing UI micro-services to Flutter](https://speakerdeck.com/d_r_1009/flutterkaigi2021)

## Elsewhere

[GitHub](https://github.com/koji-1009) · [X (@D_R_1009)](https://x.com/D_R_1009) · [Speaker Deck](https://speakerdeck.com/d_r_1009) (Japanese) · [Zenn](https://zenn.dev/koji_1009) (Japanese) · [blog.dr1009.com](https://blog.dr1009.com/) (Japanese)
