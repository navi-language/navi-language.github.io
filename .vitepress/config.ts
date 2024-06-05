import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { generateSidebar } from 'vitepress-sidebar';
import { vitePressSidebars } from '../src/doc-json';
import {
  naviDarkTheme,
  naviLanguage,
  naviLightTheme,
  naviStreamLanguage,
} from './language';

/**
 * https://github.com/jooy2/vitepress-sidebar
 */
const naviStreamSidebar = generateSidebar([
  {
    scanStartPath: 'navi-stream',
    resolvePath: '/navi-stream/',
    useTitleFromFileHeading: true,
    sortMenusByFrontmatterOrder: true,
    includeRootIndexFile: true,
  },
  {
    scanStartPath: 'zh-CN/navi-stream',
    resolvePath: '/zh-CN/navi-stream/',
    useTitleFromFileHeading: true,
    sortMenusByFrontmatterOrder: true,
    includeRootIndexFile: true,
  },
  {
    scanStartPath: 'guides',
    resolvePath: '/guides/',
    useTitleFromFileHeading: true,
    sortMenusByFrontmatterOrder: true,
    includeRootIndexFile: false,
  },
]);

const sidebars = {
  ...naviStreamSidebar,
  '/stdlib/': vitePressSidebars.stdlib,
  '/pkg/': vitePressSidebars.pkg,
};

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    lang: 'en-US',
    title: 'Navi',
    description: 'Navi is a high-performance programming language.',
    locales: {
      root: {
        label: 'English',
        lang: 'en',
        themeConfig: {
          nav: [
            {
              text: 'Install',
              link: '/installation',
            },
            { text: 'Learn', link: '/learn/' },
            {
              text: 'Playground',
              link: 'https://navi-lang.org/play/',
              target: '_blank',
            },
            { text: 'Guides', link: '/guides/' },
            { text: 'Stdlib', link: '/stdlib/' },
            { text: 'Pkg', link: '/pkg/' },
            { text: 'Navi Stream', link: '/navi-stream/' },
            {
              text: 'Tools',
              items: [
                { text: 'Overview', link: '/tools' },
                {
                  text: 'Editor Plugins',
                  items: [
                    {
                      text: 'VS Code',
                      link: 'https://marketplace.visualstudio.com/items?itemName=huacnlee.navi',
                    },
                    {
                      text: 'Zed',
                      link: 'https://github.com/navi-language/zed-navi',
                    },
                    {
                      text: 'tree-sitter-navi',
                      link: 'https://github.com/navi-language/tree-sitter-navi',
                    },
                  ],
                },
              ],
            },
            {
              text: 'Releases',
              link: '/releases',
            },
          ],
        },
      },
      'zh-CN': {
        label: '简体中文',
        lang: 'zh-CN',
        themeConfig: {
          nav: [
            {
              text: '安装',
              link: '/zh-CN/installation',
            },
            { text: '学习', link: '/learn/' },
            {
              text: '在线尝试',
              link: 'https://navi-lang.org/play/',
              target: '_blank',
            },
            { text: '教程', link: '/guides/' },
            { text: 'Stdlib', link: '/stdlib/' },
            { text: 'Pkg', link: '/pkg/' },
            { text: 'Navi Stream', link: '/zh-CN/navi-stream/' },
            {
              text: '工具',
              items: [
                { text: '概况', link: '/tools' },
                {
                  text: '编辑器插件',
                  items: [
                    {
                      text: 'VS Code',
                      link: 'https://marketplace.visualstudio.com/items?itemName=huacnlee.navi',
                    },
                    {
                      text: 'Zed',
                      link: 'https://github.com/navi-language/zed-navi',
                    },
                    {
                      text: 'tree-sitter-navi',
                      link: 'https://github.com/navi-language/tree-sitter-navi',
                    },
                  ],
                },
              ],
            },
            {
              text: '版本发布',
              link: '/releases',
            },
          ],
        },
      },
    },
    cleanUrls: true,
    markdown: {
      languages: [naviLanguage, naviStreamLanguage],
      defaultHighlightLang: 'nv',
      theme: {
        light: naviLightTheme,
        dark: naviDarkTheme,
      },
      toc: {
        level: [2, 3],
      },
    },
    vite: {
      build: {
        target: 'esnext',
      },
    },
    ignoreDeadLinks: true,
    themeConfig: {
      editLink: {
        pattern:
          'https://github.com/navi-language/navi-language.github.io/edit/main/:path',
      },
      search: {
        provider: 'local',
      },
      logo: {
        light: '/logo.svg',
        dark: '/logo-dark.svg',
      },
      outline: [2, 3],

      sidebar: sidebars as any,

      socialLinks: [
        { icon: 'github', link: 'https://github.com/navi-language' },
      ],
    },
    head: [
      [
        'link',
        {
          rel: 'icon',
          href: '/logo.svg',
          media: '(prefers-color-scheme: light)',
        },
      ],
      [
        'link',
        {
          rel: 'icon',
          href: '/logo-dark.svg',
          media: '(prefers-color-scheme: dark)',
        },
      ],
    ],
  })
);
