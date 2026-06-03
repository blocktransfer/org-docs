import clsx from 'clsx';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const sections = [
  {
    title: 'Operations',
    description: 'Internal workflows, compliance planning, and support operations.',
    to: '/docs/category/operations',
  },
  {
    title: 'Platform',
    description: 'Issuerlink, Stellar, disclosure, and platform planning notes.',
    to: '/docs/category/platform',
  },
  {
    title: 'Records',
    description: 'Static financial, tax, and onboarding records served with the site.',
    to: '/docs/records',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="BlockTransfer Org Docs"
      description="Operational documents, records, and archived posts for BlockTransfer."
    >
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Organization documentation</p>
            <Heading as="h1" className={styles.title}>
              BlockTransfer Org Docs
            </Heading>
            <p className={styles.subtitle}>
              A Docusaurus site for internal documentation, public records, and archived posts.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary" to="/docs/intro">
                Open docs
              </Link>
              <Link className="button button--secondary" to="/blog">
                View posts
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.sectionGrid}>
          {sections.map((section) => (
            <Link className={clsx(styles.sectionLink)} to={section.to} key={section.title}>
              <Heading as="h2">{section.title}</Heading>
              <p>{section.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </Layout>
  );
}
