import clsx from 'clsx';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const featuredDocuments = [
  {
    title: 'Our Values',
    description: 'The principles behind how the organization operates.',
    to: '/docs/values',
  },
  {
    title: 'Incident Response Program',
    description: 'How incidents are assessed, contained, and handled.',
    to: '/docs/incidents/response',
  },
  {
    title: 'Regulatory Examinations',
    description: 'Examination records and responses.',
    to: '/docs/examinations',
  },
  {
    title: 'Issuerlink Features',
    description: 'A closer look at the platform and its capabilities.',
    to: '/docs/platform/issuerlink-features',
  },
  {
    title: 'Operating Balances',
    description: 'Period-end balances and their availability for operations.',
    to: '/docs/finance/operating-balances',
  },
  {
    title: 'Annual Financial Records',
    description: 'Balance sheets, income statements, and supporting records.',
    to: '/docs/finance/annual-records',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="BlockTransfer Org Docs"
      description="Operational documents and records for BlockTransfer."
    >
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Organization documentation</p>
            <Heading as="h1" className={styles.title}>
              BlockTransfer Org Docs
            </Heading>
            <p className={styles.subtitle}>
              A Docusaurus site for internal documentation and public records.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary" to="/docs/intro">
                Open docs
              </Link>
              <Link className="button button--secondary" to="/docs/records">
                Browse records
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.featuredDocuments} aria-labelledby="featured-documents-heading">
          <div className={styles.featuredHeader}>
            <Heading as="h2" id="featured-documents-heading">
              Featured documents
            </Heading>
            <p>
              A few starting points from the collection. Browse the navigation groups
              or the documentation sidebar to explore the complete library.
            </p>
          </div>
          <div className={styles.sectionGrid}>
            {featuredDocuments.map((document) => (
              <Link className={clsx(styles.sectionLink)} to={document.to} key={document.title}>
                <Heading as="h3">{document.title}</Heading>
                <p>{document.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
