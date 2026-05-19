(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  const els = {
    webLanguage: $("#webLanguage"),
    txtModeTab: $("#txtModeTab"),
    epubModeTab: $("#epubModeTab"),
    txtToEpubPanel: $("#txtToEpubPanel"),
    epubToTxtPanel: $("#epubToTxtPanel"),
    txtFile: $("#txtFile"),
    epubFile: $("#epubFile"),
    coverFile: $("#coverFile"),
    encoding: $("#encoding"),
    title: $("#title"),
    author: $("#author"),
    language: $("#language"),
    frontMatterTitle: $("#frontMatterTitle"),
    publisher: $("#publisher"),
    description: $("#description"),
    convertBtn: $("#convertBtn"),
    epubConvertBtn: $("#epubConvertBtn"),
    chapterCount: $("#chapterCount"),
    encodingLabel: $("#encodingLabel"),
    fileSize: $("#fileSize"),
    chapterList: $("#chapterList"),
    status: $("#status"),
    epubStatus: $("#epubStatus"),
  };

  const state = {
    text: "",
    fileName: "",
    detectedEncoding: "",
    chapters: [],
    metadataEdited: {
      title: false,
      author: false,
    },
    uiLanguage: "zh-CN",
    activeMode: "txt2epub",
  };

  const PREVIEW_CHAPTER_LIMIT = 98;
  const UI_LANGUAGE_KEY = "txt2epub.uiLanguage";
  const AUTHOR_SCAN_LINE_LIMIT = 10;

  const I18N = {
    "zh-CN": {
      appTitle: "Txt2EPUB",
      subtitle: "本地 TXT 与 EPUB 互转",
      uiLanguage: "网页语言",
      conversionMode: "转换模式",
      txtToEpub: "TXT 转 EPUB",
      epubToTxt: "EPUB 转 TXT",
      txtWorkspace: "TXT 转 EPUB 工作区",
      epubWorkspace: "EPUB 转 TXT 工作区",
      generate: "生成 EPUB",
      workspace: "TXT 与 EPUB 互转工作区",
      fileLegend: "文件",
      txtFile: "TXT 文件",
      textEncoding: "文本编码",
      autoDetect: "自动识别",
      coverImage: "封面图片",
      epubFile: "EPUB 文件",
      exportTxt: "导出 TXT",
      metadataLegend: "元数据",
      bookTitle: "书名",
      titlePlaceholder: "自动使用文件名",
      author: "作者",
      authorPlaceholder: "未知作者",
      bookLanguage: "语言",
      chinese: "中文",
      frontMatterTitle: "前置内容标题",
      frontMatterTitlePlaceholder: "默认：开头",
      publisher: "出版者",
      description: "简介",
      preview: "转换预览",
      chapters: "章节",
      encoding: "编码",
      notSelected: "未选择",
      size: "大小",
      toc: "目录",
      emptyToc: "暂无目录",
      selectTxt: "请选择 TXT 文件",
      readingTxt: "正在读取 TXT 文件...",
      readFile: "已读取 {name}",
      readFailed: "读取 TXT 文件失败",
      generating: "正在生成 EPUB...",
      generated: "已生成 {name}",
      generateFailed: "生成 EPUB 失败",
      selectEpub: "请选择 EPUB 文件",
      convertingEpub: "正在转换 EPUB...",
      convertedTxt: "已导出 {name}",
      convertEpubFailed: "EPUB 转 TXT 失败",
      invalidEpub: "无效的 EPUB 文件",
      unsupportedZipCompression: "当前浏览器不支持这个 EPUB 的压缩方式",
      noEpubText: "没有在 EPUB 中找到可导出的正文",
      untitledBook: "未命名书籍",
      unknownAuthor: "未知作者",
      fullText: "全文",
      frontMatter: "开头",
      moreChapters: "另有 {count} 个章节",
      unsupportedEncoding: "当前浏览器不支持 {encoding} 解码",
      unsupportedCover: "封面图片请选择 JPG、PNG、GIF 或 SVG",
      coverCanvasFailed: "当前浏览器无法生成 JPG 封面",
      coverConvertFailed: "当前浏览器无法把封面图片转换为 JPG",
    },
    en: {
      appTitle: "Txt2EPUB",
      subtitle: "Local TXT and EPUB conversion",
      uiLanguage: "Page language",
      conversionMode: "Conversion mode",
      txtToEpub: "TXT to EPUB",
      epubToTxt: "EPUB to TXT",
      txtWorkspace: "TXT to EPUB workspace",
      epubWorkspace: "EPUB to TXT workspace",
      generate: "Generate EPUB",
      workspace: "TXT and EPUB workspace",
      fileLegend: "File",
      txtFile: "TXT file",
      textEncoding: "Text encoding",
      autoDetect: "Auto detect",
      coverImage: "Cover image",
      epubFile: "EPUB file",
      exportTxt: "Export TXT",
      metadataLegend: "Metadata",
      bookTitle: "Book title",
      titlePlaceholder: "Use file name automatically",
      author: "Author",
      authorPlaceholder: "Unknown author",
      bookLanguage: "Book language",
      chinese: "Chinese",
      frontMatterTitle: "Front matter title",
      frontMatterTitlePlaceholder: "Default: Front matter",
      publisher: "Publisher",
      description: "Description",
      preview: "Conversion preview",
      chapters: "Chapters",
      encoding: "Encoding",
      notSelected: "Not selected",
      size: "Size",
      toc: "Table of contents",
      emptyToc: "No chapters yet",
      selectTxt: "Select a TXT file",
      readingTxt: "Reading TXT file...",
      readFile: "Read {name}",
      readFailed: "Failed to read TXT file",
      generating: "Generating EPUB...",
      generated: "Generated {name}",
      generateFailed: "Failed to generate EPUB",
      selectEpub: "Select an EPUB file",
      convertingEpub: "Converting EPUB...",
      convertedTxt: "Exported {name}",
      convertEpubFailed: "Failed to convert EPUB to TXT",
      invalidEpub: "Invalid EPUB file",
      unsupportedZipCompression: "This browser does not support this EPUB compression method",
      noEpubText: "No exportable body text was found in the EPUB",
      untitledBook: "Untitled book",
      unknownAuthor: "Unknown author",
      fullText: "Full text",
      frontMatter: "Front matter",
      moreChapters: "{count} more chapters",
      unsupportedEncoding: "This browser does not support {encoding} decoding",
      unsupportedCover: "Choose a JPG, PNG, GIF, or SVG cover image",
      coverCanvasFailed: "This browser cannot generate a JPG cover",
      coverConvertFailed: "This browser cannot convert the cover image to JPG",
    },
  };

  const CHINESE_NUMERAL = "[零〇一二三四五六七八九十百千万两俩壹贰叁肆伍陆柒捌玖拾佰仟萬]+";
  const ENGLISH_NUMBER =
    "(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)";

  const CHAPTER_PATTERNS = [
    new RegExp(`^\\s*第\\s*(?:\\d+|${CHINESE_NUMERAL})\\s*[章节卷回篇部集]\\s*[:：、.．\\-—\\s]*(.+)?$`, "i"),
    /^\s*(?:序章|序言|前言|楔子|引子|开篇|正文|尾声|终章|后记|番外|外传)\s*(?:[:：、.．\-\s].*)?$/i,
    new RegExp(`^\\s*(?:chapter|chap\\.?|book|part|volume)\\s+(?:\\d+|[ivxlcdm]+|${ENGLISH_NUMBER})(?:\\s*[:：.．\\-—]\\s*|\\s+).*$`, "i"),
    new RegExp(`^\\s*(?:chapter|chap\\.?|book|part|volume)\\s+(?:\\d+|[ivxlcdm]+|${ENGLISH_NUMBER})\\s*$`, "i"),
    /^\s*\d{1,4}\s*[.．、]\s+\S.{0,90}$/i,
    /^\s*[一二三四五六七八九十百千万零〇两]{1,8}\s*[、.．]\s*\S.{0,90}$/i,
  ];
  const INTRO_PAGE_TITLE_PATTERN =
    /^(?:内容简介|书籍简介|作品简介|小说简介|故事简介|图书简介|简介|内容提要|内容梗概|故事梗概|梗概|文案|导读|出版说明|book\s+description|description|synopsis|summary|introduction|about\s+(?:this\s+)?book)$/i;

  const MIME_TYPES = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
  };

  els.webLanguage.addEventListener("change", handleWebLanguageChange);
  els.txtModeTab.addEventListener("click", () => switchMode("txt2epub"));
  els.epubModeTab.addEventListener("click", () => switchMode("epub2txt"));
  els.txtFile.addEventListener("change", handleTxtFile);
  els.epubFile.addEventListener("change", handleEpubFile);
  els.encoding.addEventListener("change", handleTxtFile);
  els.convertBtn.addEventListener("click", convertCurrentFile);
  els.epubConvertBtn.addEventListener("click", convertEpubFile);
  els.title.addEventListener("input", () => handleMetadataInput("title"));
  els.author.addEventListener("input", () => handleMetadataInput("author"));
  els.frontMatterTitle.addEventListener("input", refreshPreview);

  function initUiLanguage() {
    const savedLanguage = localStorage.getItem(UI_LANGUAGE_KEY);
    const browserLanguage = navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en";
    state.uiLanguage = I18N[savedLanguage] ? savedLanguage : browserLanguage;
    els.webLanguage.value = state.uiLanguage;
    applyI18n();
  }

  function handleWebLanguageChange() {
    state.uiLanguage = I18N[els.webLanguage.value] ? els.webLanguage.value : "zh-CN";
    localStorage.setItem(UI_LANGUAGE_KEY, state.uiLanguage);
    applyI18n();
    refreshPreview();
  }

  function switchMode(mode) {
    state.activeMode = mode === "epub2txt" ? "epub2txt" : "txt2epub";
    const isTxtMode = state.activeMode === "txt2epub";

    els.txtModeTab.classList.toggle("is-active", isTxtMode);
    els.epubModeTab.classList.toggle("is-active", !isTxtMode);
    els.txtModeTab.setAttribute("aria-selected", String(isTxtMode));
    els.epubModeTab.setAttribute("aria-selected", String(!isTxtMode));
    els.txtToEpubPanel.hidden = !isTxtMode;
    els.epubToTxtPanel.hidden = isTxtMode;

    if (isTxtMode && !state.text) {
      setStatus(t("selectTxt"));
    }
    if (!isTxtMode && !els.epubFile.files[0]) {
      setEpubStatus(t("selectEpub"));
    }
  }

  function applyI18n() {
    document.documentElement.lang = state.uiLanguage;
    document.title = t("appTitle");
    for (const node of document.querySelectorAll("[data-i18n]")) {
      node.textContent = t(node.dataset.i18n);
    }
    for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
      node.placeholder = t(node.dataset.i18nPlaceholder);
    }
    for (const node of document.querySelectorAll("[data-i18n-aria]")) {
      node.setAttribute("aria-label", t(node.dataset.i18nAria));
    }
    els.chapterList.dataset.empty = t("emptyToc");
    if (!state.text) {
      setStatus(t("selectTxt"));
    }
    if (!els.epubFile.files[0]) {
      setEpubStatus(t("selectEpub"));
    }
    if (!state.detectedEncoding) {
      els.encodingLabel.textContent = t("notSelected");
    }
  }

  async function handleTxtFile() {
    const file = els.txtFile.files[0];
    resetStatus();

    if (!file) {
      state.text = "";
      state.fileName = "";
      state.detectedEncoding = "";
      state.chapters = [];
      if (!state.metadataEdited.title) {
        els.title.value = "";
      }
      if (!state.metadataEdited.author) {
        els.author.value = "";
      }
      els.fileSize.textContent = "-";
      els.convertBtn.disabled = true;
      refreshPreview();
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const decoded = decodeText(buffer, els.encoding.value);
      state.text = normalizeLineEndings(decoded.text);
      state.fileName = file.name;
      state.detectedEncoding = decoded.encoding;
      state.chapters = splitIntoChapters(state.text);

      if (!state.metadataEdited.title || !els.title.value.trim()) {
        els.title.value = stripExtension(file.name);
      }
      if (!state.metadataEdited.author || !els.author.value.trim()) {
        els.author.value = detectAuthorFromText(state.text) || "";
      }

      els.fileSize.textContent = formatBytes(file.size);
      els.convertBtn.disabled = false;
      setStatus(t("readFile", { name: file.name }));
      refreshPreview();
    } catch (error) {
      state.text = "";
      state.chapters = [];
      els.fileSize.textContent = "-";
      els.convertBtn.disabled = true;
      setStatus(error.message || t("readFailed"), true);
      refreshPreview();
    }
  }

  function handleMetadataInput(field) {
    state.metadataEdited[field] = Boolean(els[field].value.trim());
    refreshPreview();
  }

  function handleEpubFile() {
    const file = els.epubFile.files[0];
    els.epubConvertBtn.disabled = !file;
    setEpubStatus(file ? t("readFile", { name: file.name }) : t("selectEpub"));
  }

  async function convertCurrentFile() {
    if (!state.text) {
      setStatus(t("selectTxt"), true);
      return;
    }

    try {
      els.convertBtn.disabled = true;
      setStatus(t("generating"));

      const metadata = collectMetadata();
      const cover = await prepareCover(metadata);
      const epubBytes = buildEpub({
        metadata,
        chapters: state.chapters.length ? state.chapters : fallbackChapters(state.text),
        cover,
      });

      const fileName = `${safeFileName(metadata.title || stripExtension(state.fileName) || "book")}.epub`;
      downloadBlob(new Blob([epubBytes], { type: "application/epub+zip" }), fileName);
      setStatus(t("generated", { name: fileName }));
    } catch (error) {
      setStatus(error.message || t("generateFailed"), true);
    } finally {
      els.convertBtn.disabled = !state.text;
    }
  }

  async function convertEpubFile() {
    const file = els.epubFile.files[0];
    if (!file) {
      setEpubStatus(t("selectEpub"), true);
      return;
    }

    try {
      els.epubConvertBtn.disabled = true;
      setEpubStatus(t("convertingEpub"));

      const result = await epubToTxt(await file.arrayBuffer(), file.name);
      const fileName = `${safeFileName(result.title || stripExtension(file.name) || "book")}.txt`;
      downloadBlob(new Blob([result.text], { type: "text/plain;charset=utf-8" }), fileName);
      setEpubStatus(t("convertedTxt", { name: fileName }));
    } catch (error) {
      setEpubStatus(error.message || t("convertEpubFailed"), true);
    } finally {
      els.epubConvertBtn.disabled = !els.epubFile.files[0];
    }
  }

  function collectMetadata() {
    const title = els.title.value.trim() || stripExtension(state.fileName) || t("untitledBook");
    const author = els.author.value.trim() || t("unknownAuthor");
    const requestedLanguage = els.language.value;

    return {
      title,
      author,
      language: requestedLanguage === "auto" ? detectLanguage(state.text) : requestedLanguage,
      publisher: els.publisher.value.trim(),
      description: els.description.value.trim(),
      identifier: makeUuid(),
      modified: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    };
  }

  function detectAuthorFromText(text) {
    const lines = text.split("\n").slice(0, AUTHOR_SCAN_LINE_LIMIT);
    const patterns = [
      /(?:^|[《〈「『"\[][^》〉」』"\]]{1,80}[》〉」』"\]]\s*)?(?:作者|作\s*者|著者|编者|撰者|原著|作者名)\s*[:：=]\s*(.+)$/i,
      /^(?:作者|作\s*者|著者|编者|撰者|原著|作者名)\s+(.+)$/i,
      /^(?:文|文案|by|author|written\s+by)\s*[:：=]\s*(.+)$/i,
      /^by\s+(.+)$/i,
      /^author\s+(.+)$/i,
    ];

    for (const line of lines) {
      const value = line.trim();
      if (!value) continue;

      for (const pattern of patterns) {
        const match = value.match(pattern);
        if (!match) continue;

        const author = cleanDetectedAuthor(match[1]);
        if (author) return author;
      }
    }

    return "";
  }

  function cleanDetectedAuthor(value) {
    return String(value || "")
      .replace(/(?:[，,;；|｜/].*)$/, "")
      .replace(/\s*(?:著|撰|编|作品|出品)\s*$/i, "")
      .replace(/^\s*[：:=]\s*/, "")
      .replace(/^["“”'‘’《〈「『【\[]+|["“”'‘’》〉」』】\]]+$/g, "")
      .trim()
      .replace(/\s+/g, " ");
  }

  function decodeText(buffer, requestedEncoding) {
    const bytes = new Uint8Array(buffer);
    const bom = detectBom(bytes);

    if (requestedEncoding !== "auto") {
      return {
        text: decodeWithLabel(buffer, requestedEncoding),
        encoding: labelEncoding(requestedEncoding),
      };
    }

    if (bom) {
      return {
        text: decodeWithLabel(buffer, bom),
        encoding: labelEncoding(bom),
      };
    }

    const nullPattern = guessUtf16ByNulls(bytes);
    if (nullPattern) {
      return {
        text: decodeWithLabel(buffer, nullPattern),
        encoding: labelEncoding(nullPattern),
      };
    }

    const candidates = ["utf-8", "gb18030", "big5", "utf-16le", "utf-16be"];
    const scored = candidates.map((encoding) => {
      const text = decodeWithLabel(buffer, encoding);
      return { encoding, text, score: scoreDecodedText(text, encoding) };
    });

    scored.sort((a, b) => b.score - a.score);
    return {
      text: scored[0].text,
      encoding: labelEncoding(scored[0].encoding),
    };
  }

  function detectBom(bytes) {
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return "utf-8";
    if (bytes[0] === 0xff && bytes[1] === 0xfe) return "utf-16le";
    if (bytes[0] === 0xfe && bytes[1] === 0xff) return "utf-16be";
    return "";
  }

  function guessUtf16ByNulls(bytes) {
    const sampleLength = Math.min(bytes.length, 4000);
    if (sampleLength < 8) return "";

    let evenNulls = 0;
    let oddNulls = 0;
    for (let i = 0; i < sampleLength; i += 1) {
      if (bytes[i] !== 0) continue;
      if (i % 2 === 0) evenNulls += 1;
      else oddNulls += 1;
    }

    const pairs = sampleLength / 2;
    if (oddNulls / pairs > 0.28 && evenNulls / pairs < 0.05) return "utf-16le";
    if (evenNulls / pairs > 0.28 && oddNulls / pairs < 0.05) return "utf-16be";
    return "";
  }

  function decodeWithLabel(buffer, label) {
    try {
      return new TextDecoder(label).decode(buffer);
    } catch (error) {
      throw new Error(t("unsupportedEncoding", { encoding: labelEncoding(label) }));
    }
  }

  function scoreDecodedText(text, encoding) {
    const sample = text.slice(0, 24000);
    const replacement = countMatches(sample, /\uFFFD/g);
    const controls = countMatches(sample, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g);
    const cjk = countMatches(sample, /[\u3400-\u9FFF]/g);
    const asciiLetters = countMatches(sample, /[a-z]/gi);
    const punctuation = countMatches(sample, /[，。！？、；：“”‘’（）《》,.!?;:'"()[\]]/g);
    const mojibake = countMatches(sample, /[锟斤拷烫屯�]/g);
    const lineBreaks = countMatches(sample, /\n/g);

    let score = 1000;
    score -= replacement * 80;
    score -= controls * 45;
    score -= mojibake * 10;
    score += Math.min(cjk, 800) * 1.6;
    score += Math.min(asciiLetters, 1200) * 0.45;
    score += Math.min(punctuation, 500) * 0.6;
    score += Math.min(lineBreaks, 300) * 0.8;

    if (encoding === "utf-8" && replacement === 0) score += 40;
    if ((encoding === "utf-16le" || encoding === "utf-16be") && controls > 10) score -= 400;
    return score;
  }

  function splitIntoChapters(text) {
    const lines = text.split("\n");
    const chapterStarts = [];
    let offset = 0;

    for (const line of lines) {
      if (isChapterTitle(line)) {
        chapterStarts.push({ title: cleanChapterTitle(line), offset });
      }
      offset += line.length + 1;
    }

    if (!chapterStarts.length) return [];

    const sections = [];
    const leadingText = text.slice(0, chapterStarts[0].offset);
    if (leadingText.trim()) {
      sections.push({
        titleKey: "frontMatter",
        body: leadingText.replace(/\n+$/, ""),
      });
    }

    for (const [index, chapter] of chapterStarts.entries()) {
      const next = chapterStarts[index + 1];
      const raw = text.slice(chapter.offset, next ? next.offset : text.length);
      const firstLineBreak = raw.indexOf("\n");
      const body = firstLineBreak >= 0 ? raw.slice(firstLineBreak + 1) : "";
      sections.push({
        title: chapter.title,
        body: body.replace(/^\n+/, ""),
      });
    }

    return sections.map((section, index) => ({
      ...section,
      id: `chapter-${String(index + 1).padStart(4, "0")}`,
    }));
  }

  function isChapterTitle(line) {
    const value = line.trim();
    if (!value || value.length > 120) return false;
    if (/[。！？!?]$/.test(value) && value.length > 32) return false;
    return CHAPTER_PATTERNS.some((pattern) => pattern.test(value));
  }

  function cleanChapterTitle(line) {
    return line.trim().replace(/\s+/g, " ");
  }

  function fallbackChapters(text) {
    return [
      {
        id: "chapter-0001",
        titleKey: "fullText",
        body: text,
      },
    ];
  }

  async function epubToTxt(buffer, fileName) {
    const entries = await readZipEntries(buffer);
    const containerEntry = findZipEntry(entries, "META-INF/container.xml");
    if (!containerEntry) throw new Error(t("invalidEpub"));

    const containerXml = parseXml(bytesToText(await zipEntryBytes(containerEntry)));
    const rootfile = getElementsByLocalName(containerXml, "rootfile")[0];
    const opfPath = rootfile && normalizeZipPath(rootfile.getAttribute("full-path") || "");
    const opfEntry = opfPath && findZipEntry(entries, opfPath);
    if (!opfEntry) throw new Error(t("invalidEpub"));

    const opfBase = pathDirname(opfPath);
    const opfXml = parseXml(bytesToText(await zipEntryBytes(opfEntry)));
    const metadata = getElementsByLocalName(opfXml, "metadata")[0] || opfXml;
    const title = normalizeWhitespace(getFirstTextByLocalName(metadata, "title")) || stripExtension(fileName);
    const manifest = readManifest(opfXml, opfBase);
    const spineIds = getElementsByLocalName(opfXml, "itemref")
      .map((itemref) => itemref.getAttribute("idref"))
      .filter(Boolean);
    const tocTitles = await readEpubTocTitles(entries, manifest);
    const sections = [];

    for (const id of spineIds) {
      const item = manifest.get(id);
      const itemEntry = item && findZipEntry(entries, item.path);
      if (!item || !isHtmlMediaType(item.mediaType) || !itemEntry) continue;

      const section = extractHtmlSection(bytesToText(await zipEntryBytes(itemEntry)));
      const sectionTitle = tocTitles.get(item.path) || section.title;
      const sectionText = removeRedundantSectionHeading(section.text, sectionTitle);
      if (isLikelyCoverSection(item, sectionTitle, sectionText)) continue;
      if (!sectionText.trim()) continue;

      sections.push({
        title: sectionTitle,
        text: sectionText,
      });
    }

    const contentText = sections.map((section) => section.text.trim()).filter(Boolean).join("\n\n");
    if (!contentText.trim()) throw new Error(t("noEpubText"));

    const contentChapters = splitIntoChapters(contentText);
    const text = contentChapters.length ? makeTxtFromContentSections(sections) : makeTxtFromTocSections(sections);

    return {
      title,
      text: `${text.replace(/\s+$/, "")}\n`,
    };
  }

  function readManifest(opfXml, opfBase) {
    const manifest = new Map();
    for (const item of getElementsByLocalName(opfXml, "item")) {
      const id = item.getAttribute("id");
      const href = item.getAttribute("href");
      if (!id || !href) continue;
      manifest.set(id, {
        id,
        href,
        path: joinZipPath(opfBase, href),
        mediaType: item.getAttribute("media-type") || "",
        properties: item.getAttribute("properties") || "",
      });
    }
    return manifest;
  }

  async function readEpubTocTitles(entries, manifest) {
    const titles = new Map();
    const navItem = Array.from(manifest.values()).find((item) => item.properties.split(/\s+/).includes("nav"));
    const ncxItem = Array.from(manifest.values()).find((item) => item.mediaType === "application/x-dtbncx+xml");
    const navEntry = navItem && findZipEntry(entries, navItem.path);
    const ncxEntry = ncxItem && findZipEntry(entries, ncxItem.path);

    if (navItem && navEntry) {
      const navDoc = parseHtml(bytesToText(await zipEntryBytes(navEntry)));
      for (const link of Array.from(navDoc.querySelectorAll("a[href]"))) {
        const href = link.getAttribute("href");
        const label = normalizeWhitespace(link.textContent);
        if (href && label) titles.set(joinZipPath(pathDirname(navItem.path), href), label);
      }
    }

    if (!titles.size && ncxItem && ncxEntry) {
      const ncxXml = parseXml(bytesToText(await zipEntryBytes(ncxEntry)));
      for (const point of getElementsByLocalName(ncxXml, "navPoint")) {
        const content = getElementsByLocalName(point, "content")[0];
        const label = normalizeWhitespace(getFirstTextByLocalName(point, "text"));
        const src = content && content.getAttribute("src");
        if (src && label) titles.set(joinZipPath(pathDirname(ncxItem.path), src), label);
      }
    }

    return titles;
  }

  function makeTxtFromTocSections(sections) {
    return sections
      .map((section) => {
        const text = section.text.trim();
        const title = cleanChapterTitle(section.title || "");
        if (!title || textStartsWithTitle(text, title)) return text;
        return `${title}\n\n${text}`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  function makeTxtFromContentSections(sections) {
    return sections
      .map((section) => {
        const text = section.text.trim();
        const title = cleanChapterTitle(section.title || "");
        if (!text) return "";
        if (isIntroPageTitle(title) && !splitIntoChapters(text).length && !textStartsWithTitle(text, title)) {
          return `${title}\n\n${text}`;
        }
        return text;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  function removeRedundantSectionHeading(text, title) {
    const lines = normalizeLineEndings(text).split("\n");
    const firstContentIndex = lines.findIndex((line) => line.trim());
    if (firstContentIndex < 0) return text;

    const firstLine = lines[firstContentIndex].trim();
    const rest = lines.slice(firstContentIndex + 1).join("\n");
    if (!splitIntoChapters(rest).length) return text;
    if (title && normalizeWhitespace(firstLine) === normalizeWhitespace(title)) {
      return [...lines.slice(0, firstContentIndex), ...lines.slice(firstContentIndex + 1)].join("\n").replace(/^\n+/, "");
    }
    if (!isGenericChapterHeading(firstLine)) return text;

    return [...lines.slice(0, firstContentIndex), ...lines.slice(firstContentIndex + 1)].join("\n").replace(/^\n+/, "");
  }

  function isGenericChapterHeading(line) {
    const value = line.trim();
    return (
      new RegExp(`^第\\s*(?:\\d+|${CHINESE_NUMERAL})\\s*[章节回篇]\\s*$`, "i").test(value) ||
      new RegExp(`^(?:chapter|chap\\.?)\\s+(?:\\d+|[ivxlcdm]+|${ENGLISH_NUMBER})\\s*$`, "i").test(value)
    );
  }

  function isIntroPageTitle(title) {
    return INTRO_PAGE_TITLE_PATTERN.test(normalizeWhitespace(title));
  }

  async function readZipEntries(buffer) {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const eocdOffset = findEndOfCentralDirectory(view);
    if (eocdOffset < 0) throw new Error(t("invalidEpub"));

    const fileCount = view.getUint16(eocdOffset + 10, true);
    const centralOffset = view.getUint32(eocdOffset + 16, true);
    const entries = new Map();
    let offset = centralOffset;

    for (let index = 0; index < fileCount; index += 1) {
      if (view.getUint32(offset, true) !== 0x02014b50) throw new Error(t("invalidEpub"));

      const flags = view.getUint16(offset + 8, true);
      const method = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const nameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localOffset = view.getUint32(offset + 42, true);
      const nameStart = offset + 46;
      const name = decodeZipName(bytes.slice(nameStart, nameStart + nameLength), flags);
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);

      if (name && !name.endsWith("/")) {
        entries.set(normalizeZipPath(name), { compressed, method, bytes: null });
      }

      offset = nameStart + nameLength + extraLength + commentLength;
    }

    return entries;
  }

  async function zipEntryBytes(entry) {
    if (!entry.bytes) {
      entry.bytes = await inflateZipEntry(entry.compressed, entry.method);
    }
    return entry.bytes;
  }

  function findEndOfCentralDirectory(view) {
    const minOffset = Math.max(0, view.byteLength - 0xffff - 22);
    for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
      if (view.getUint32(offset, true) === 0x06054b50) return offset;
    }
    return -1;
  }

  async function inflateZipEntry(bytes, method) {
    if (method === 0) return bytes;
    if (method !== 8 || !("DecompressionStream" in window)) {
      throw new Error(t("unsupportedZipCompression"));
    }

    try {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      return new Uint8Array(await new Response(stream).arrayBuffer());
    } catch (error) {
      throw new Error(t("unsupportedZipCompression"));
    }
  }

  function decodeZipName(bytes, flags) {
    const decoder = flags & 0x0800 ? new TextDecoder("utf-8") : new TextDecoder("utf-8");
    return decoder.decode(bytes);
  }

  function findZipEntry(entries, path) {
    const normalized = normalizeZipPath(path);
    if (entries.has(normalized)) return entries.get(normalized);
    const lower = normalized.toLowerCase();
    for (const [name, bytes] of entries) {
      if (name.toLowerCase() === lower) return bytes;
    }
    return null;
  }

  function parseXml(text) {
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (getElementsByLocalName(doc, "parsererror").length) throw new Error(t("invalidEpub"));
    return doc;
  }

  function parseHtml(text) {
    return new DOMParser().parseFromString(text, "text/html");
  }

  function extractHtmlSection(html) {
    const doc = parseHtml(html);
    const title =
      normalizeWhitespace(doc.querySelector("h1, h2, h3") && doc.querySelector("h1, h2, h3").textContent) ||
      normalizeWhitespace(doc.querySelector("title") && doc.querySelector("title").textContent);
    const body = doc.body || doc.documentElement;
    const chunks = [];
    appendPlainText(body, chunks, { skipHeadings: true });
    return {
      title,
      text: normalizeExtractedText(chunks.join("")),
    };
  }

  function appendPlainText(node, chunks, options = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      chunks.push(node.nodeValue || "");
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.localName.toLowerCase();
    if (["script", "style", "svg", "head", "nav"].includes(tag)) return;
    if (options.skipHeadings && /^h[1-6]$/.test(tag)) return;
    if (tag === "br") {
      chunks.push("\n");
      return;
    }

    const isBlock = /^(address|article|aside|blockquote|body|dd|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|ol|p|pre|section|table|tbody|td|tfoot|th|thead|tr|ul)$/.test(tag);
    if (isBlock) chunks.push("\n");

    for (const child of Array.from(node.childNodes)) {
      appendPlainText(child, chunks, options);
    }

    if (isBlock) chunks.push("\n");
  }

  function normalizeExtractedText(text) {
    return text
      .replace(/\u00a0/g, " ")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t\f\v]+/g, " ")
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function getElementsByLocalName(root, localName) {
    return Array.from(root.getElementsByTagName("*")).filter((node) => node.localName === localName);
  }

  function getFirstTextByLocalName(root, localName) {
    const element = getElementsByLocalName(root, localName)[0];
    return element ? element.textContent || "" : "";
  }

  function bytesToText(bytes) {
    return new TextDecoder("utf-8").decode(bytes);
  }

  function isHtmlMediaType(mediaType) {
    return /(?:application\/xhtml\+xml|text\/html)/i.test(mediaType);
  }

  function isLikelyCoverSection(item, title, text) {
    const value = `${item.id} ${item.href} ${item.properties} ${title || ""}`;
    return /(^|\W)(cover|封面)(\W|$)/i.test(value) && text.trim().length < 220;
  }

  function textStartsWithTitle(text, title) {
    const firstLine = text.split("\n").find((line) => line.trim()) || "";
    return normalizeWhitespace(firstLine) === normalizeWhitespace(title);
  }

  function joinZipPath(base, href) {
    const cleanHref = String(href || "").split("#")[0];
    if (!cleanHref) return normalizeZipPath(base);
    return normalizeZipPath(base ? `${base}/${cleanHref}` : cleanHref);
  }

  function pathDirname(path) {
    const normalized = normalizeZipPath(path);
    const index = normalized.lastIndexOf("/");
    return index >= 0 ? normalized.slice(0, index) : "";
  }

  function normalizeZipPath(path) {
    const parts = [];
    for (const part of String(path || "").replace(/\\/g, "/").split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") parts.pop();
      else parts.push(part);
    }
    return parts.join("/");
  }

  function normalizeWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  async function prepareCover(metadata) {
    const file = els.coverFile.files[0];
    if (file) {
      const ext = extensionOf(file.name) || mimeToExtension(file.type) || "jpg";
      if (!MIME_TYPES[ext]) {
        throw new Error(t("unsupportedCover"));
      }
      const bytes = ext === "jpg" || ext === "jpeg" ? new Uint8Array(await file.arrayBuffer()) : await convertImageFileToJpeg(file);
      return {
        path: "images/cover.jpg",
        mediaType: "image/jpeg",
        bytes,
        isSvg: false,
      };
    }

    const jpeg = await makeCoverJpeg(metadata);
    return {
      path: "images/cover.jpg",
      mediaType: "image/jpeg",
      bytes: jpeg,
      isSvg: false,
    };
  }

  function buildEpub({ metadata, chapters, cover }) {
    const files = [];
    const chapterItems = chapters.map((chapter, index) => ({
      id: chapter.id,
      href: `text/${chapter.id}.xhtml`,
      title: chapterTitle(chapter, index),
      content: makeChapterXhtml({ ...chapter, title: chapterTitle(chapter, index) }, metadata.language),
    }));

    files.push({ path: "mimetype", bytes: asciiBytes("application/epub+zip") });
    files.push({ path: "META-INF/container.xml", bytes: utf8Bytes(makeContainerXml()) });
    files.push({ path: "OEBPS/styles.css", bytes: utf8Bytes(makeEpubCss()) });
    files.push({ path: "OEBPS/nav.xhtml", bytes: utf8Bytes(makeNavXhtml(metadata, chapterItems)) });
    files.push({ path: "OEBPS/cover.xhtml", bytes: utf8Bytes(makeCoverXhtml(metadata, cover)) });
    files.push({ path: `OEBPS/${cover.path}`, bytes: cover.bytes });

    for (const chapter of chapterItems) {
      files.push({ path: `OEBPS/${chapter.href}`, bytes: utf8Bytes(chapter.content) });
    }

    files.push({
      path: "OEBPS/content.opf",
      bytes: utf8Bytes(makeContentOpf(metadata, chapterItems, cover)),
    });

    return makeZip(files);
  }

  function makeContainerXml() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  }

  function makeContentOpf(metadata, chapters, cover) {
    const chapterManifest = chapters
      .map((chapter) => `    <item id="${chapter.id}" href="${chapter.href}" media-type="application/xhtml+xml"/>`)
      .join("\n");
    const chapterSpine = chapters.map((chapter) => `    <itemref idref="${chapter.id}"/>`).join("\n");
    const publisher = metadata.publisher
      ? `    <dc:publisher>${xmlEscape(metadata.publisher)}</dc:publisher>\n`
      : "";
    const description = metadata.description
      ? `    <dc:description>${xmlEscape(metadata.description)}</dc:description>\n`
      : "";

    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${xmlEscape(metadata.language)}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">urn:uuid:${xmlEscape(metadata.identifier)}</dc:identifier>
    <dc:title>${xmlEscape(metadata.title)}</dc:title>
    <dc:creator>${xmlEscape(metadata.author)}</dc:creator>
    <dc:language>${xmlEscape(metadata.language)}</dc:language>
${publisher}${description}    <meta property="dcterms:modified">${xmlEscape(metadata.modified)}</meta>
    <meta name="cover" content="cover-image"/>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="style" href="styles.css" media-type="text/css"/>
    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml"/>
    <item id="cover-image" href="${xmlEscape(cover.path)}" media-type="${xmlEscape(cover.mediaType)}" properties="cover-image"/>
${chapterManifest}
  </manifest>
  <spine>
    <itemref idref="cover-page"/>
${chapterSpine}
  </spine>
  <guide>
    <reference type="cover" title="Cover" href="cover.xhtml"/>
  </guide>
</package>`;
  }

  function makeNavXhtml(metadata, chapters) {
    const items = chapters
      .map((chapter) => `      <li><a href="${xmlEscape(chapter.href)}">${xmlEscape(chapter.title)}</a></li>`)
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${xmlEscape(metadata.language)}" xml:lang="${xmlEscape(metadata.language)}">
  <head>
    <title>${xmlEscape(metadata.title)} - 目录</title>
    <link rel="stylesheet" type="text/css" href="styles.css"/>
  </head>
  <body>
    <nav epub:type="toc" id="toc">
      <h1>目录</h1>
      <ol>
${items}
      </ol>
    </nav>
  </body>
</html>`;
  }

  function makeCoverXhtml(metadata, cover) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${xmlEscape(metadata.language)}" xml:lang="${xmlEscape(metadata.language)}">
  <head>
    <title>${xmlEscape(metadata.title)}</title>
    <link rel="stylesheet" type="text/css" href="styles.css"/>
  </head>
  <body class="cover-page">
    <img class="cover-image" src="${xmlEscape(cover.path)}" alt="${xmlEscape(metadata.title)}"/>
  </body>
</html>`;
  }

  function makeChapterXhtml(chapter, language) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${xmlEscape(language)}" xml:lang="${xmlEscape(language)}">
  <head>
    <title>${xmlEscape(chapter.title)}</title>
    <link rel="stylesheet" type="text/css" href="../styles.css"/>
  </head>
  <body>
    <section epub:type="chapter">
      <h1>${xmlEscape(chapter.title)}</h1>
      <pre class="body-text">${xmlEscape(chapter.body)}</pre>
    </section>
  </body>
</html>`;
  }

  function makeEpubCss() {
    return `body {
  margin: 0;
  padding: 1.2em;
  font-family: serif;
  line-height: 1.65;
}

h1 {
  margin: 0 0 1.4em;
  font-size: 1.55em;
  line-height: 1.3;
  text-align: center;
}

.body-text {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-family: inherit;
  font-size: 1em;
  line-height: 1.75;
}

ol {
  line-height: 1.6;
}

.cover-page {
  margin: 0;
  padding: 0;
  text-align: center;
}

.cover-image {
  width: 100%;
  height: 100vh;
  object-fit: contain;
}`;
  }

  async function makeCoverJpeg(metadata) {
    const width = 1800;
    const height = 2400;
    const safeOffsetX = 100;
    const centerX = width / 2;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error(t("coverCanvasFailed"));
    }

    ctx.fillStyle = "#f6f4ef";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fffefa";
    ctx.strokeStyle = "#216869";
    ctx.lineWidth = 10;
    drawRoundedRect(ctx, safeOffsetX + 108, 108, 1384, 2184, 24);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#d7a942";
    ctx.lineWidth = 10;
    drawLine(ctx, safeOffsetX + 260, 560, safeOffsetX + 1340, 560);

    ctx.strokeStyle = "#216869";
    ctx.lineWidth = 6;
    drawLine(ctx, safeOffsetX + 360, 1840, safeOffsetX + 1240, 1840);

    ctx.fillStyle = "#222426";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const titleLayout = fitCoverTitle(ctx, metadata.title || t("untitledBook"));
    ctx.font = titleLayout.font;
    drawCanvasLines(ctx, titleLayout.lines, centerX, 980, titleLayout.lineHeight, titleLayout.maxWidth);

    ctx.fillStyle = "#697179";
    ctx.font = coverFont("400", 76);
    ctx.fillText(metadata.author || t("unknownAuthor"), centerX, 1580, 1100);

    const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
    return new Uint8Array(await blob.arrayBuffer());
  }

  async function convertImageFileToJpeg(file) {
    try {
      const image = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 2400;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error(t("coverCanvasFailed"));

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawImageContain(ctx, image, canvas.width, canvas.height);

      if (typeof image.close === "function") {
        image.close();
      }

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      return new Uint8Array(await blob.arrayBuffer());
    } catch (error) {
      throw new Error(t("coverConvertFailed"));
    }
  }

  async function loadImage(file) {
    if ("createImageBitmap" in window) {
      try {
        return await createImageBitmap(file);
      } catch (error) {
        // Fall back to HTMLImageElement for formats the bitmap decoder rejects.
      }
    }

    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(t("coverConvertFailed")));
      };
      image.src = url;
    });
  }

  function drawImageContain(ctx, image, targetWidth, targetHeight) {
    const imageWidth = image.width || image.naturalWidth;
    const imageHeight = image.height || image.naturalHeight;
    const scale = Math.min(targetWidth / imageWidth, targetHeight / imageHeight);
    const width = imageWidth * scale;
    const height = imageHeight * scale;
    const x = (targetWidth - width) / 2;
    const y = (targetHeight - height) / 2;
    ctx.drawImage(image, x, y, width, height);
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    const right = x + width;
    const bottom = y + height;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(right - radius, y);
    ctx.quadraticCurveTo(right, y, right, y + radius);
    ctx.lineTo(right, bottom - radius);
    ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
    ctx.lineTo(x + radius, bottom);
    ctx.quadraticCurveTo(x, bottom, x, bottom - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function fitCoverTitle(ctx, title) {
    const maxWidth = 1160;
    const maxLines = 4;
    const minSize = 126;
    const maxSize = 176;

    for (let size = maxSize; size >= minSize; size -= 10) {
      ctx.font = coverFont("700", size);
      const lines = wrapCanvasText(ctx, title, maxWidth, maxLines);
      if (!lines.some((line) => line.endsWith("..."))) {
        return {
          font: ctx.font,
          lines,
          lineHeight: Math.round(size * 1.18),
          maxWidth,
        };
      }
    }

    ctx.font = coverFont("700", minSize);
    return {
      font: ctx.font,
      lines: wrapCanvasText(ctx, title, maxWidth, maxLines),
      lineHeight: Math.round(minSize * 1.18),
      maxWidth,
    };
  }

  function coverFont(weight, size) {
    return `${weight} ${size}px Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif`;
  }

  function drawCanvasLines(ctx, lines, x, y, lineHeight, maxWidth) {
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, x, startY + index * lineHeight, maxWidth);
    });
  }

  function wrapCanvasText(ctx, text, maxWidth, maxLines) {
    const value = String(text || "").trim() || t("untitledBook");
    const hasCjk = /[\u3400-\u9FFF]/.test(value);
    const tokens = hasCjk ? Array.from(value) : value.split(/(\s+)/).filter(Boolean);
    const lines = [];
    let current = "";

    for (const token of tokens) {
      const candidate = current ? `${current}${token}` : token.trimStart();
      if (ctx.measureText(candidate).width <= maxWidth || !current) {
        current = candidate;
        continue;
      }

      lines.push(current.trim());
      current = token.trimStart();
      if (lines.length === maxLines) break;
    }

    if (lines.length < maxLines && current.trim()) {
      lines.push(current.trim());
    }

    if (lines.length > maxLines) {
      lines.length = maxLines;
    }

    const consumedLength = lines.join(hasCjk ? "" : " ").length;
    if (consumedLength < value.length && lines.length) {
      lines[lines.length - 1] = truncateCanvasText(ctx, lines[lines.length - 1], maxWidth);
    }

    return lines.length ? lines : [t("untitledBook")];
  }

  function truncateCanvasText(ctx, text, maxWidth) {
    const ellipsis = "...";
    let value = text;
    while (value.length > 1 && ctx.measureText(`${value}${ellipsis}`).width > maxWidth) {
      value = value.slice(0, -1);
    }
    return `${value}${ellipsis}`;
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error(t("coverCanvasFailed")));
        },
        type,
        quality,
      );
    });
  }

  function makeZip(files) {
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for (const file of files) {
      const nameBytes = utf8Bytes(file.path);
      const data = file.bytes instanceof Uint8Array ? file.bytes : new Uint8Array(file.bytes);
      const crc = crc32(data);
      const localHeader = makeLocalHeader(nameBytes, data, crc);
      const centralHeader = makeCentralHeader(nameBytes, data, crc, offset);

      localParts.push(localHeader, data);
      centralParts.push(centralHeader);
      offset += localHeader.length + data.length;
    }

    const centralStart = offset;
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = makeEndOfCentralDirectory(files.length, centralSize, centralStart);
    return concatUint8Arrays([...localParts, ...centralParts, end]);
  }

  function makeLocalHeader(nameBytes, data, crc) {
    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
    header.set(nameBytes, 30);
    return header;
  }

  function makeCentralHeader(nameBytes, data, crc, offset) {
    const header = new Uint8Array(46 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0x0800, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, crc, true);
    view.setUint32(20, data.length, true);
    view.setUint32(24, data.length, true);
    view.setUint16(28, nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, offset, true);
    header.set(nameBytes, 46);
    return header;
  }

  function makeEndOfCentralDirectory(fileCount, centralSize, centralStart) {
    const end = new Uint8Array(22);
    const view = new DataView(end.buffer);
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, fileCount, true);
    view.setUint16(10, fileCount, true);
    view.setUint32(12, centralSize, true);
    view.setUint32(16, centralStart, true);
    view.setUint16(20, 0, true);
    return end;
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i += 1) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeCrcTable() {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let c = i;
      for (let k = 0; k < 8; k += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c >>> 0;
    }
    return table;
  }

  function refreshPreview() {
    els.chapterCount.textContent = String(state.chapters.length || (state.text ? 1 : 0));
    els.encodingLabel.textContent = state.detectedEncoding || t("notSelected");

    els.chapterList.innerHTML = "";
    const chapters = state.chapters.length ? state.chapters : state.text ? fallbackChapters(state.text) : [];
    chapters.slice(0, PREVIEW_CHAPTER_LIMIT).forEach((chapter, index) => {
      const item = document.createElement("li");
      const chapterIndex = document.createElement("span");
      const chapterTitle = document.createElement("span");
      chapterIndex.className = "chapter-index";
      chapterTitle.className = "chapter-title";
      chapterIndex.textContent = `${index + 1}.`;
      chapterTitle.textContent = chapterTitleForPreview(chapter, index);
      item.appendChild(chapterIndex);
      item.appendChild(chapterTitle);
      els.chapterList.appendChild(item);
    });

    if (chapters.length > PREVIEW_CHAPTER_LIMIT) {
      const item = document.createElement("li");
      const chapterIndex = document.createElement("span");
      const chapterTitle = document.createElement("span");
      chapterIndex.className = "chapter-index";
      chapterTitle.className = "chapter-title";
      chapterIndex.textContent = `${PREVIEW_CHAPTER_LIMIT + 1}.`;
      chapterTitle.textContent = t("moreChapters", { count: chapters.length - PREVIEW_CHAPTER_LIMIT });
      item.appendChild(chapterIndex);
      item.appendChild(chapterTitle);
      els.chapterList.appendChild(item);
    }
  }

  function setStatus(message, isError) {
    els.status.textContent = message;
    els.status.classList.toggle("is-error", Boolean(isError));
  }

  function setEpubStatus(message, isError) {
    els.epubStatus.textContent = message;
    els.epubStatus.classList.toggle("is-error", Boolean(isError));
  }

  function resetStatus() {
    setStatus(t("readingTxt"));
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function detectLanguage(text) {
    const sample = text.slice(0, 16000);
    const cjk = countMatches(sample, /[\u3400-\u9FFF]/g);
    const latin = countMatches(sample, /[a-z]/gi);
    return cjk >= Math.max(12, latin * 0.18) ? "zh-CN" : "en";
  }

  function normalizeLineEndings(text) {
    return text.replace(/\r\n?/g, "\n");
  }

  function stripExtension(fileName) {
    return fileName.replace(/\.[^.]+$/, "");
  }

  function extensionOf(fileName) {
    const match = /\.([a-z0-9]+)$/i.exec(fileName);
    return match ? match[1].toLowerCase() : "";
  }

  function mimeToExtension(mime) {
    const found = Object.entries(MIME_TYPES).find(([, value]) => value === mime);
    return found ? found[0] : "";
  }

  function safeFileName(value) {
    return value.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim() || "book";
  }

  function formatBytes(value) {
    if (!Number.isFinite(value)) return "-";
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / 1024 / 1024).toFixed(1)} MB`;
  }

  function labelEncoding(value) {
    const labels = {
      "utf-8": "UTF-8",
      gb18030: "GBK/GB2312/GB18030",
      big5: "BIG5",
      "utf-16le": "UTF-16 LE",
      "utf-16be": "UTF-16 BE",
    };
    return labels[value] || value.toUpperCase();
  }

  function countMatches(text, pattern) {
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
  }

  function makeUuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function xmlEscape(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function asciiBytes(value) {
    const bytes = new Uint8Array(value.length);
    for (let i = 0; i < value.length; i += 1) {
      bytes[i] = value.charCodeAt(i) & 0x7f;
    }
    return bytes;
  }

  function utf8Bytes(value) {
    return new TextEncoder().encode(value);
  }

  function concatUint8Arrays(parts) {
    const length = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;
    for (const part of parts) {
      result.set(part, offset);
      offset += part.length;
    }
    return result;
  }

  function chapterTitle(chapter, index) {
    return chapter.title || (chapter.titleKey ? titleForKey(chapter.titleKey) : `第 ${index + 1} 章`);
  }

  function chapterTitleForPreview(chapter, index) {
    return chapter.title || (chapter.titleKey ? titleForKey(chapter.titleKey) : `#${index + 1}`);
  }

  function titleForKey(key) {
    if (key === "frontMatter") {
      return els.frontMatterTitle.value.trim() || t("frontMatter");
    }
    return t(key);
  }

  function t(key, params) {
    const dictionary = I18N[state.uiLanguage] || I18N["zh-CN"];
    const fallback = I18N["zh-CN"][key] || key;
    let value = dictionary[key] || fallback;
    for (const [name, replacement] of Object.entries(params || {})) {
      value = value.replaceAll(`{${name}}`, replacement);
    }
    return value;
  }

  // TODO: Batch conversion can call this same pipeline per selected file.
  const CRC_TABLE = makeCrcTable();
  initUiLanguage();
  refreshPreview();
})();
