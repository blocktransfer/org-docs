# Historical documentation version protection

The contents of `versions/` are published historical documentation snapshots.
Changes to those snapshots (including additions, deletions, and renames) and
changes to the root `versions.json` manifest need **explicit approval** before
they can enter `main`.

## Activate the required GitHub ruleset

This repository does not load rulesets from committed files. A repository
administrator must set up the policy in GitHub after merging this PR:

1. Open [Repository settings → Rules → Rulesets](https://github.com/blocktransfer/org-docs/settings/rules) and create a **branch ruleset** named **Protect historical versions**.
2. Set enforcement to **Active** and target the default branch, `main`.
3. Enable **Require a pull request before merging**. Keep the *general*
   required approval count at **0** if ordinary documentation changes should
   continue without mandatory approval.
4. Under **Required reviewers**, choose a designated `blocktransfer`
   organization **team** with write access to this repository and set
   **Minimum approvals: 1**. Enter these file patterns:
   ```gitignore
   versions/**
   versions.json
   .github/CODEOWNERS
   ```
5. Enable **Dismiss stale pull request approvals when new commits are pushed**
   so approval must still cover subsequent changes. Do not configure a bypass
   actor if all changes to the archives must be reviewed.
6. Save the ruleset, then verify its enforcement on a test pull request before
   considering the historical releases protected.

**The ruleset's Required reviewers option accepts an organization team, not
an individual GitHub username.** Select an existing authorized team or create
one first, with a reviewer other than the author of the PR. GitHub does not
allow authors to approve their own pull requests.

## CODEOWNERS

`.github/CODEOWNERS` separately requests review from `@JFWooten4` when a
PR touches an archived version, the version manifest, or the ownership file
itself. CODEOWNERS **does not block a merge by itself**; the active ruleset
above provides enforcement. If the organization wants a different reviewer,
update CODEOWNERS in a reviewed PR.

As an alternative, administrators may enable **Require review from Code
Owners** on the branch ruleset, but combining that setting with a nonzero
general approval requirement can require reviews for unrelated pull requests.
The file-patterned **Required reviewers** rule is preferred for targeted
protection.

## Verification

After activating the ruleset, confirm that:

- A PR changing only `docs/` is unaffected by the version-specific approval rule.
- A PR adding, editing, deleting, or renaming a file under `versions/` is
  blocked until an eligible team member explicitly approves it.
- A PR changing `versions.json` or `.github/CODEOWNERS` also requires approval.
- A new commit changing the PR diff makes the previous approval stale when
  stale-approval dismissal is enabled.
- A direct push to `main` does not bypass the PR requirement.

GitHub documentation:
- [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
