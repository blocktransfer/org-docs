import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BlockTransfer Org Docs',
  tagline: 'Operational documents, records, and archived posts.',
  url: 'https://blocktransfer.org',
  baseUrl: '/org-docs/',
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
            },
            '0.1.0': {
              label: '2 Jun 2026',
              banner: 'none',
            },
          },
        },
        blog: {
          path: 'old_posts',
          routeBasePath: 'blog',
          blogTitle: 'Archived Posts',
          blogDescription: 'Older BlockTransfer posts preserved with the organization docs.',
          showReadingTime: true,
          editUrl: 'https://github.com/blocktransfer/org-docs/tree/main/',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
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
