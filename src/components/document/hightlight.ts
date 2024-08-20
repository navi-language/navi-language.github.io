import { fromHighlighter } from "@shikijs/markdown-it/core";
import type { MarkdownItShikiSetupOptions } from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import { getHighlighter } from "shiki";

import naviDark from "../../navi-dark.theme.json";
import naviLight from "../../navi-light.theme.json";
import naviStreamLanguageGrammar from "../../navi-stream.tmLanguage.json";
import naviLanguageGrammar from "../../navi.tmLanguage.json";

const naviLanguage: any = {
  aliases: ["navi", "nv", "nv,", "nv,no_run", "no_run", "nv, no_run"],
  ...naviLanguageGrammar,
};

const naviStreamLanguage: any = {
  aliases: ["nvs"],
  ...naviStreamLanguageGrammar,
};

const highlighter = await getHighlighter({
  langs: ["javascript", "json", "bash", "toml", "yaml", "plaintext", "diff"],
  themes: [],
});

await highlighter.loadLanguage(naviLanguage, naviStreamLanguage);
await highlighter.loadTheme(naviLight as any, naviDark as any);

const shikiConfig: MarkdownItShikiSetupOptions = {
  themes: {
    light: "navi-light",
    dark: "navi-dark",
  },
  trimEndingNewline: true,
  cssVariablePrefix: "--shiki-",
  parseMetaString: (metaString: string, code: string, lang: string) => {
    console.log(metaString, code, lang);
    return {};
  },
};

/**
 * Highlight code to HTML
 * @param code
 * @param lang
 * @returns
 */
export function highlight(code: string, lang: string) {
  lang = lang.split(",")[0];
  return highlighter.codeToHtml(code, {
    ...shikiConfig,
    lang,
    structure: "inline",
  });
}

function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, "")
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, "")
    .replace(/(-vue|{| ).*$/, "")
    .replace(/^vue-html$/, "template")
    .replace(/^ansi$/, "");
}

// https://github.com/vuejs/vitepress/blob/ed6ada7a688c466920f3e0ef33b7176b8eb01eee/src/node/markdown/plugins/preWrapper.ts
export function preWrapperPlugin(md: MarkdownIt, options: any) {
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];

    // remove title from info
    token.info = token.info.replace(/\[.*\]/, "");

    const active = / active( |$)/.test(token.info) ? " active" : "";
    token.info = token.info.replace(/ active$/, "").replace(/ active /, " ");

    const lang = extractLang(token.info);

    return (
      `<div class="language-${lang}">` +
      `<button class="copy"></button>` +
      `<span class="lang">${lang}</span>` +
      fence(...args) +
      "</div>"
    );
  };
}

const md = MarkdownIt()
  .use(fromHighlighter(highlighter, shikiConfig))
  .use(preWrapperPlugin);

/**
 * Render Markdown to HTML
 */
export function renderMarkdown(markdown: string) {
  return md.render(markdown);
}
