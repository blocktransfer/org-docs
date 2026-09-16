import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const stripBlogPostDate = (permalink: string): string =>
  permalink.replace(/^(\/blog)\/\d{4}\/\d{1,2}\/\d{1,2}\//, '$1/');

const config: Config = {
  title: 'BlockTransfer Org Docs',
  tagline: 'Operational documents, records, and posts.',
  favicon: 'img/icon.png',
  url: 'https://blocktransfer.org',
  baseUrl: '/',
  organizationName: 'blocktransfer',
  projectName: 'org-docs',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/blocktransfer/org-docs/tree/main/',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Current',
              badge: false,
            },
            '0.1.0': {
              label: '2 Jun 2026',
              banner: 'none',
            },
          },
        },
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          blogTitle: 'Posts',
          blogDescription: 'BlockTransfer posts and organizational references.',
          showReadingTime: true,
          editUrl: 'https://github.com/blocktransfer/org-docs/tree/main/',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
          processBlogPosts: async ({blogPosts}) => {
            const processedPosts = blogPosts.map((post) => ({
              ...post,
              metadata: {
                ...post.metadata,
                permalink: stripBlogPostDate(post.metadata.permalink),
              },
            }));
            const permalinks = new Set<string>();
            for (const post of processedPosts) {
              if (permalinks.has(post.metadata.permalink)) {
                throw new Error(
                  `Duplicate blog-post permalink: ${post.metadata.permalink}`,
                );
              }
              permalinks.add(post.metadata.permalink);
            }
            return processedPosts;
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 12,
        searchResultContextMaxLength: 80,
        searchBarShortcut: false,
        searchBarPosition: 'right',
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'BlockTransfer',
      logo: {
        alt: 'BlockTransfer logo',
        src: 'img/icon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Posts', position: 'left'},
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/blocktransfer/org-docs',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Records', to: '/docs/records'},
            {label: 'Incidents', to: '/docs/incidents'},
          ],
        },
        {
          title: 'Repository',
          items: [
            {label: 'GitHub', href: 'https://github.com/blocktransfer/org-docs'},
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} BlockTransfer.`,
    },
    prism: {
      additionalLanguages: ['powershell', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
