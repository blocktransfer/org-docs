import type {ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import clsx from 'clsx';

const {historyUrlForMissingPath, repositoryHistoryUrl} = require('./history.cjs');

interface Props {
  readonly className?: string;
}

function MissingUrlHistory(): ReactNode {
  return (
    <BrowserOnly
      fallback={
        <p>
          <a href={repositoryHistoryUrl}>Browse the repository's Git history</a>{' '}
          to investigate old file paths.
        </p>
      }>
      {() => {
        const pathname = window.location.pathname;
        const historyUrl = historyUrlForMissingPath(pathname);

        return (
          <>
            <p>
              Missing URL: <code>{pathname}</code>
            </p>
            <p>
              <a href={historyUrl}>
                {historyUrl === repositoryHistoryUrl
                  ? "Browse the repository's Git history"
                  : 'Investigate this path in GitHub history'}
              </a>
              {' '}to find previous versions or see when a path changed.
            </p>
          </>
        );
      }}
    </BrowserOnly>
  );
}

export default function NotFoundContent({className}: Props): ReactNode {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--8 col--offset-2">
          <Heading as="h1" className="hero__title">Page Not Found</Heading>
          <p>The requested page or file is not available at this URL.</p>
          <MissingUrlHistory />
          <div className="alert alert--info" role="note">
            <strong>Archived versions:</strong> File locations can change over time.
            Historical versions may contain links to files that have been moved,
            renamed, or removed. Those original paths are not guaranteed to remain
            available.
          </div>
          <p className="margin-top--md">
            For currently published files, see the <Link to="/docs/records">Records page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
