import {useEffect, useState} from 'react';
import styles from './IncidentLog.module.css';

type IncidentIssue = {
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  created_at: string;
  closed_at: string | null;
  comments: number;
  pull_request?: unknown;
};

type StatusFilter = 'all' | 'open' | 'closed';

const repo = 'blocktransfer/org-docs';
const issueSearchUrl = 'https://github.com/' + repo + '/issues?q=is%3Aissue+label%3Aincident';

async function fetchIncidents(signal: AbortSignal): Promise<IncidentIssue[]> {
  const result: IncidentIssue[] = [];
  let page = 1;
  while (true) {
    const params = new URLSearchParams({
      labels: 'incident',
      state: 'all',
      sort: 'created',
      direction: 'desc',
      per_page: '100',
      page: String(page),
    });
    const response = await fetch(
      'https://api.github.com/repos/' + repo + '/issues?' + params.toString(),
      {signal, headers: {Accept: 'application/vnd.github+json'}},
    );
    if (!response.ok) throw new Error('GitHub returned HTTP ' + response.status);

    const batch: IncidentIssue[] = await response.json();
    if (!Array.isArray(batch)) throw new Error('Unexpected GitHub response');
    // The GitHub issues API also includes pull requests.
    result.push(...batch.filter((issue) =>
      !issue.pull_request &&
      Number.isInteger(issue.number) &&
      (issue.state === 'open' || issue.state === 'closed')
    ));
    if (batch.length < 100) break;
    page++;
  }
  return result.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

function dateLabel(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

function excerpt(body: string | null): string {
  const plain = (body ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return 'No public summary provided.';
  if (plain.length <= 320) return plain;
  return plain.slice(0, 320).replace(/\s+\S*$/, '').trimEnd() + '…';
}

export default function IncidentLog() {
  const [issues, setIssues] = useState<IncidentIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchIncidents(controller.signal)
      .then((rows) => {
        if (!controller.signal.aborted) setIssues(rows);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Unknown error');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);

  const open = issues.filter((issue) => issue.state === 'open').length;
  const query = search.trim().toLowerCase();
  const shown = issues.filter((issue) =>
    (status === 'all' || issue.state === status) &&
    (issue.title + ' ' + (issue.body ?? '') + ' #' + issue.number)
      .toLowerCase().includes(query)
  );

  return (
    <section className={styles.log} aria-label="Incident records">
      <p className={styles.intro}>
        Public incident reports are collected from issues labeled <code>incident</code> in the{' '}
        <a href={issueSearchUrl}>org-docs repository</a>. GitHub retains the full reports,
        discussion, and closure history.
      </p>

      {!loading && !error && (
        <>
          <div className={styles.totals} aria-label="Incident counts">
            <div><strong>{issues.length}</strong><span>Total reports</span></div>
            <div><strong>{open}</strong><span>Open</span></div>
            <div><strong>{issues.length - open}</strong><span>Closed</span></div>
          </div>
          <div className={styles.toolbar}>
            <div className={styles.filters} role="group" aria-label="Filter by status">
              {(['all', 'open', 'closed'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={status === value ? styles.activeFilter : styles.filter}
                  aria-pressed={status === value}
                  onClick={() => setStatus(value)}>
                  {value === 'all' ? 'All' : value === 'open' ? 'Open' : 'Closed'}
                </button>
              ))}
            </div>
            <input
              type="search"
              aria-label="Search incident records"
              placeholder="Search incidents"
              className={styles.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </>
      )}

      {loading && <p role="status" className={styles.notice}>Loading incident reports from GitHub…</p>}
      {!loading && error && (
        <div role="alert" className={styles.notice}>
          <p>Could not load incident reports ({error}). GitHub may be unavailable or rate-limiting requests.</p>
          <button type="button" className="button button--secondary button--sm"
            onClick={() => setRetry((value) => value + 1)}>Retry</button>
          {' '}<a href={issueSearchUrl}>Browse on GitHub</a>
        </div>
      )}
      {!loading && !error && shown.length === 0 && (
        <p role="status" className={styles.notice}>
          {issues.length ? 'No incidents match these filters.' : 'No incident reports have been published yet.'}
        </p>
      )}
      {!loading && !error && (
        <div className={styles.records}>
          {shown.map((issue) => (
            <article className={styles.record} key={issue.number}>
              <div className={styles.header}>
                <span className={styles.number}>ISSUE #{issue.number}</span>
                <span className={issue.state === 'open' ? styles.open : styles.closed}>
                  {issue.state === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
              <h2 className={styles.title}>
                <a href={'https://github.com/' + repo + '/issues/' + issue.number}>
                  {issue.title}
                </a>
              </h2>
              <p className={styles.summary}>{excerpt(issue.body)}</p>
              <div className={styles.footer}>
                <div className={styles.metadata}>
                  <span>Reported <time dateTime={issue.created_at}>{dateLabel(issue.created_at)}</time></span>
                  {issue.closed_at && (
                    <span>Closed <time dateTime={issue.closed_at}>{dateLabel(issue.closed_at)}</time></span>
                  )}
                  <span>{issue.comments} {issue.comments === 1 ? 'comment' : 'comments'}</span>
                </div>
                <a className={styles.source}
                  href={'https://github.com/' + repo + '/issues/' + issue.number}>
                  View full record ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
