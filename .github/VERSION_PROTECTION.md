# Version archive approval policy

The **sole source of truth** for archived versions is the directory suffixes
under `versions/archive-<version>/`. No committed version manifest is needed.

Docusaurus itself still requires a root `versions.json`. The build, development,
and version-creation scripts reconstruct that file **temporarily** from the
archive directories, then delete it and the generated Docusaurus inputs.
The root manifest is ignored by Git. Do **not** create `versions/history.json`.

Protected changes include:

- All paths under `versions/`, including archived snapshots and sidebars.
- `versions.json` to prevent reintroducing a checked-in version list.
- The version generation, staging and cleanup scripts under `scripts/`.
- `package.json`, `.gitignore`, the version-protection policy, and the
  privileged verifier workflow and helper files to prevent unreviewed bypasses.

Any PR targeting main that modifies a protected path (including removals
and old names of renamed files) requires an explicit APPROVED review of
the PR's **current head commit** from another human with write/admin
permission on this repository. A stale, self, bot, dismissed, or read-only
review does not qualify.

Other PRs automatically receive a passing `version-archives` status
without any approval requirement. GitHub API failures fail closed.

## Configure the ruleset after merging

As with SEC-publications, the enforcement is a GitHub branch ruleset
requiring a verified status check; **CODEOWNERS is not used**. Committing
workflows does not itself enable GitHub branch protection.

In [Repository settings → Rules → Rulesets](https://github.com/blocktransfer/org-docs/settings/rules),
create an active branch ruleset called **Version archive protection**:

1. Target the default branch (`main`).
2. Require a pull request before merging, with 0 generally required
   approvals (the status check handles path-specific approvals).
3. Require the commit status `version-archives` to pass. Where available,
   select GitHub Actions as the expected source.
4. Prohibit force pushes and deletions; do not configure bypass permissions.
5. Verify a test PR changing `versions/archive-0.1.0/` is blocked until
   another write/admin collaborator approves the current head SHA.
   Confirm that a `docs/`-only PR passes without this approval.

After merging the workflow, open or update a PR to produce the first
`version-archives` check if the ruleset UI does not yet list it.

## Testing and version creation

- `npm run test:versions` verifies archive detection, manifest generation,
  staging, and cleanup.
- `npm run build` reconstructs the temporary manifest, runs Docusaurus,
  then cleans it up **even on failure**.
- `npm start` reconstructs the same inputs for the development server
  and cleans up when the server exits.
- `npm run version:docs -- <version>` reconstructs the current versions,
  runs Docusaurus version creation, copies the new archive and sidebar to
  `versions/`, and removes the temporary manifest. Existing archives
  cannot be overwritten by this command.

The version number list is generated newest-first using numeric-aware
sorting of folder suffixes, matching Docusaurus's required ordering.

## Trusted status-check execution

The privileged `version-archive-review.yml` workflow checks out **main**
only, never PR-controlled code. An unprivileged
`version-archive-review-signal.yml` workflow emits a validated numeric
PR number for review-event rechecks. The trusted workflow independently
fetches the changed paths and reviews through the GitHub API.

Run `node --test .github/scripts/version-archive-review.test.cjs`
to verify approval logic.
