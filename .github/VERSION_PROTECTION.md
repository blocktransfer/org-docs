# Version archive approval policy

Protected content:

- All files under versions/, including archived snapshots, sidebars, and a
  future versions/history.json manifest.
- The current Docusaurus manifest at the repository root: versions.json.
- This policy and the privileged verification workflow/helper scripts, to
  prevent changes that could quietly disable the approval gate.

A pull request targeting main that changes any protected path (including a
deletion or a rename out of a protected path) requires an explicit APPROVED
GitHub review **on its current head commit** from a different human with
write/admin access to this repository. Older approvals, the PR author's own
approval, bot approvals, dismissed approvals, and read-only reviews do not
qualify. If a newer commit is pushed, a fresh approval is necessary.

Pull requests that change no protected paths receive a successful
version-archives commit status automatically without requiring review.
Failures querying GitHub fail closed.

## Activate the ruleset after merging

GitHub rulesets are administrator-managed repository settings; they cannot be
activated by committing a file. Unlike CODEOWNERS, this project uses the same
trusted status-check architecture as the SEC-publications repository.

In [Repository settings → Rules → Rulesets](https://github.com/blocktransfer/org-docs/settings/rules),
create an **active branch ruleset** called **Version archive protection**:

1. Target the **default branch** (main).
2. **Require a pull request before merging**, with **0 generally required
   approving reviews** (the status check handles path-specific approvals).
3. Under **Require status checks to pass**, add the context
   **version-archives**. Where available, select **GitHub Actions** as the
   expected source.
4. Prohibit force pushes and deletions. Do not configure bypass permissions.
5. Save the ruleset and confirm an archive-edit PR stays blocked until a
   separate write/admin collaborator approves the PR's current head commit.
   Confirm a docs-only PR passes with no additional review.

To make the status selectable, first merge these workflows to main and open
or update a test PR targeting main so version-archives runs once. You can then
select it as a required check in the ruleset UI.

**Important:** Merely merging this PR does not activate protection. The
ruleset must be created by an administrator, and protecting the ruleset
settings themselves remains an administrative responsibility. Do not permit
general GitHub App or administrator bypass if approval is mandatory.

## Trusted execution design

- The privileged workflow version-archive-review.yml only checks out the
  trusted main branch (never the contributor's PR head). It reads changed file
  names, reviewers, and permissions from GitHub's API and writes a status.
- A separate, unprivileged pull_request_review workflow uploads only a
  numeric PR identifier to prompt reevaluation when an approval is added,
  edited, or dismissed. The privileged workflow validates that identifier
  and independently fetches the current PR, diff, and reviews.
- Tests run locally using:
  node --test .github/scripts/version-archive-review.test.cjs
- Review the required checks again if changing these workflow files.
