import Link from '@docusaurus/Link';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import OriginalDocVersionBanner from '@theme-original/DocVersionBanner';
import type {Props} from '@theme/DocVersionBanner';
import clsx from 'clsx';
import type {ReactNode} from 'react';

export default function DocVersionBanner({className}: Props): ReactNode {
  const versionMetadata = useDocsVersion();

  if (versionMetadata.version === '0.1.0') {
    return (
      <div
        className={clsx(
          className,
          'theme-doc-version-banner',
          'alert alert--info margin-bottom--md',
        )}
        role="note">
        <strong>Archived compliance snapshot from 3 Jun 2026.</strong>{' '}
        This page preserves the organization docs as they existed on that date.
        For the latest editable materials, see the{' '}
        <Link to="/docs/intro">current docs</Link>.
      </div>
    );
  }

  return <OriginalDocVersionBanner className={className} />;
}
