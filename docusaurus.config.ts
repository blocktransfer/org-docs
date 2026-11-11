import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BlockTransfer Org Docs',
  tagline: 'Operational documents and records.',
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
            '0.2.0': {
              label: '14 Sep 2026',
              banner: 'none',
            },
            '0.1.0': {
              label: '2 Jun 2026',
              banner: 'none',
            },
          },
        },
        blog: false,
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
        indexBlog: false,
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
          type: 'dropdown',
          label: 'Organization',
          position: 'left',
          items: [
            {type: 'doc', docId: 'intro', label: 'Introduction'},
            {type: 'doc', docId: 'team', label: 'Team'},
            {type: 'doc', docId: 'values', label: 'Values'},
            {type: 'doc', docId: 'glossary', label: 'Glossary'},
          ],
        },
        {
          type: 'dropdown',
          label: 'Operations',
          position: 'left',
          items: [
            {type: 'doc', docId: 'operations/hot-operations', label: 'Hot Operations'},
            {type: 'doc', docId: 'operations/extreme-compliance', label: 'Extreme Compliance'},
            {type: 'doc', docId: 'platform/issuerlink-features', label: 'Issuerlink Features'},
            {type: 'doc', docId: 'investors/investor-correspondence', label: 'Investor Correspondence'},
          ],
        },
        {
          type: 'dropdown',
          label: 'Compliance',
          position: 'left',
          items: [
            {type: 'doc', docId: 'examinations/index', label: 'Examinations'},
            {type: 'doc', docId: 'incidents/index', label: 'Incidents'},
            {type: 'doc', docId: 'incidents/response', label: 'Incident Response Program'},
            {type: 'doc', docId: 'records', label: 'Records'},
          ],
        },
        {
          type: 'dropdown',
          label: 'Financials',
          position: 'left',
          items: [
            {type: 'doc', docId: 'finance/index', label: 'Taxes & Financials'},
            {type: 'doc', docId: 'finance/how-finances-work', label: 'How Finances Work'},
            {type: 'doc', docId: 'finance/annual-records', label: 'Annual Financial Records'},
            {type: 'doc', docId: 'taxes/index', label: 'Tax Records'},
          ],
        },
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
      copyright: `BlockTrans Syndicate · ${new Date().getFullYear()} <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>`,
    },
    prism: {
      additionalLanguages: ['powershell', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
