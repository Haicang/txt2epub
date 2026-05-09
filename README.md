# Txt2EPUB

Txt2EPUB 是一个本地浏览器应用，可以把单个 `.txt` 文件转换成 `.epub` 文件。它完全在浏览器中运行，因此 TXT 内容和封面图片都会留在你的电脑上。

## 使用方法

1. 在 macOS、Windows 或 Linux 上，用 Chrome、Chromium 或 Edge 打开 `index.html`。
2. 选择一个 `.txt` 文件。
3. 按需填写图书元数据。
4. 可选上传一张封面图片。
5. 点击 **Generate EPUB** / **生成 EPUB**。
6. 保存下载的 `.epub` 文件。

不需要后端服务、安装依赖包或网络连接。

## 支持的浏览器

- Chrome
- Chromium
- Microsoft Edge

本应用使用了现代浏览器 API，例如 `File`、`Blob`、`TextDecoder` 和本地下载。

## 功能

- 本地 TXT 转 EPUB。
- 中英文网页界面。
- 第一版支持单文件转换。
- 自动或手动选择 TXT 编码。
- 根据检测到的章节生成 EPUB 目录。
- 一级目录。
- EPUB 元数据字段：
  - 标题
  - 作者
  - 语言
  - 出版方
  - 简介
- 未选择封面图片时自动生成 JPG 文字封面。
- 可选上传封面。
- EPUB 正文会保留原 TXT 中的空格和换行。

## TXT 编码

本应用可以自动检测或手动解码：

- UTF-8
- GBK / GB2312 / GB18030
- BIG5
- UTF-16 LE
- UTF-16 BE

自动检测是启发式的。如果预览显示异常，请手动选择编码。

## 章节检测

本应用可以检测常见的中文和英文章节标题，包括：

- `第一章 初见`
- `第1章 初见`
- `序章`
- `楔子`
- `尾声`
- `后记`
- `Chapter 1 The Beginning`
- `CHAPTER ONE`
- `1. Introduction`
- `一、前言`

如果第一章之前存在文本，它会被保留为正文前置内容。

## 封面图片

支持上传的封面格式：

- JPG / JPEG
- PNG
- GIF
- SVG

如果没有上传封面，本应用会根据标题和作者生成一个简单的 JPG 封面，并写入 EPUB 封面元数据。上传 PNG、GIF 或 SVG 时，也会转换成 JPG 后写入 EPUB。

## 预览行为

章节预览最多显示 98 个章节。如果章节更多，第 99 行预览会显示还有多少章节被隐藏。

生成的 EPUB 仍会包含所有检测到的章节。

## 当前限制

- 每次只能转换一个 TXT 文件。
- 不支持嵌套目录或多级目录。
- 非常大的 TXT 文件可能会占用较多浏览器内存。
- EPUB 校验取决于阅读应用；生成的 EPUB 使用简单的 EPUB 3 结构。

## 路线图

- TODO: 基于现有单文件转换流程添加批量转换。
- 根据真实样本改进章节检测规则。
- 添加下载前的可选 EPUB 阅读预览。

---

Txt2EPUB is a local browser app for converting a single `.txt` file into an `.epub` file. It runs entirely in the browser, so the TXT content and cover image stay on your computer.

## Usage

1. Open `index.html` in Chrome, Chromium, or Edge on macOS, Windows, or Linux.
2. Select a `.txt` file.
3. Fill in book metadata if needed.
4. Optionally upload a cover image.
5. Click **Generate EPUB** / **生成 EPUB**.
6. Save the downloaded `.epub` file.

No backend service, package install, or network connection is required.

## Supported Browsers

- Chrome
- Chromium
- Microsoft Edge

The app uses modern browser APIs such as `File`, `Blob`, `TextDecoder`, and local downloads.

## Features

- Local TXT to EPUB conversion.
- Chinese and English web interface.
- Single-file conversion in the first version.
- Automatic or manual TXT encoding selection.
- EPUB table of contents generated from detected chapters.
- One-level table of contents.
- EPUB metadata fields:
  - title
  - author
  - language
  - publisher
  - description
- Automatic JPG text cover when no cover image is selected.
- Optional cover upload.
- Original TXT spaces and line breaks are preserved in the EPUB body.

## TXT Encoding

The app can auto-detect or manually decode:

- UTF-8
- GBK / GB2312 / GB18030
- BIG5
- UTF-16 LE
- UTF-16 BE

Auto-detection is heuristic. If the preview looks wrong, choose the encoding manually.

## Chapter Detection

The app detects common Chinese and English chapter headings, including:

- `第一章 初见`
- `第1章 初见`
- `序章`
- `楔子`
- `尾声`
- `后记`
- `Chapter 1 The Beginning`
- `CHAPTER ONE`
- `1. Introduction`
- `一、前言`

If text appears before the first detected chapter, it is preserved as a front matter section.

## Cover Images

Supported uploaded cover formats:

- JPG / JPEG
- PNG
- GIF
- SVG

If no cover is uploaded, the app generates a simple JPG cover from the title and author and writes EPUB cover metadata. Uploaded PNG, GIF, or SVG covers are also converted to JPG before they are written into the EPUB.

## Preview Behavior

The chapter preview shows up to 98 chapters. If there are more, the 99th preview row shows how many chapters are hidden.

The generated EPUB still includes all detected chapters.

## Current Limitations

- Only one TXT file can be converted at a time.
- Nested or multi-level tables of contents are not supported.
- Very large TXT files may use substantial browser memory.
- EPUB validation depends on the reading app; the generated EPUB follows a simple EPUB 3 structure.

## Roadmap

- TODO: Add batch conversion using the existing single-file conversion pipeline.
- Improve chapter detection rules from real-world samples.
- Add optional EPUB reading preview before download.
