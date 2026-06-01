#!/usr/bin/env python3
"""Sync GitHub Discussions in the Risks category into the risk register."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


REGISTER_PATH = Path("incidents/risk-register.md")
PROMPT_MARKER = "<!-- risk-register-metadata-request -->"
INVALID_MARKER = "<!-- risk-register-metadata-invalid -->"
RESPONSE_RE = re.compile(r"```risk-register\s*(.*?)```", re.IGNORECASE | re.DOTALL)
FIELD_RE = re.compile(r"^([A-Za-z _-]+):\s*(.*)$")
ROW_RE = re.compile(r"^\|\s*R-(\d+)\s*\|")


@dataclass
class RiskMetadata:
    category: str
    owner: str
    likelihood: int
    impact: int
    mitigation: str
    status: str
    review_date: str


def run(args: list[str], *, check: bool = True, input_text: str | None = None) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        args,
        check=False,
        input=input_text,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if check and result.returncode != 0:
        print(result.stdout, end="")
        print(result.stderr, end="", file=sys.stderr)
        raise SystemExit(result.returncode)
    return result


def gh_graphql(query: str, **fields: str) -> dict:
    args = ["gh", "api", "graphql", "-f", f"query={query}"]
    for key, value in fields.items():
        args.extend(["-f", f"{key}={value}"])
    result = run(args)
    return json.loads(result.stdout)


def repository_parts() -> tuple[str, str]:
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    if "/" not in repository:
        raise SystemExit("GITHUB_REPOSITORY must be set to owner/repo.")
    owner, repo = repository.split("/", 1)
    return owner, repo


def risk_category_id(owner: str, repo: str, category_name: str) -> str:
    data = gh_graphql(
        """
        query($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            discussionCategories(first: 50) {
              nodes { id name }
            }
          }
        }
        """,
        owner=owner,
        repo=repo,
    )
    categories = data["data"]["repository"]["discussionCategories"]["nodes"]
    for category in categories:
        if category["name"].lower() == category_name.lower():
            return category["id"]
    available = ", ".join(category["name"] for category in categories)
    raise SystemExit(f"Discussion category {category_name!r} not found. Available: {available}")


def open_risk_discussions(owner: str, repo: str, category_id: str) -> list[dict]:
    data = gh_graphql(
        """
        query($owner: String!, $repo: String!, $categoryId: ID!) {
          repository(owner: $owner, name: $repo) {
            discussions(
              first: 50,
              states: OPEN,
              categoryId: $categoryId,
              orderBy: {field: UPDATED_AT, direction: DESC}
            ) {
              nodes {
                id
                number
                title
                url
                body
                author { login }
                comments(first: 100) {
                  nodes {
                    body
                    author { login }
                    createdAt
                  }
                }
              }
            }
          }
        }
        """,
        owner=owner,
        repo=repo,
        categoryId=category_id,
    )
    return data["data"]["repository"]["discussions"]["nodes"]


def add_discussion_comment(discussion_id: str, body: str) -> None:
    gh_graphql(
        """
        mutation($discussionId: ID!, $body: String!) {
          addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
            comment { id }
          }
        }
        """,
        discussionId=discussion_id,
        body=body,
    )


def prompt_body(author: str) -> str:
    return f"""{PROMPT_MARKER}
@{author}, this risk can be added to the risk register after likelihood and impact are identified.

Please reply with this exact fenced format:

```risk-register
likelihood: 3
impact: 4
category: TBD
owner: TBD
mitigation: TBD
status: Open
review_date: TBD
```

Use whole numbers from 0 to 10 for likelihood and impact."""


def invalid_body(author: str, reason: str) -> str:
    return f"""{INVALID_MARKER}
@{author}, I found a `risk-register` response, but could not add it yet.

Issue: {reason}

Please reply again using:

```risk-register
likelihood: 3
impact: 4
category: TBD
owner: TBD
mitigation: TBD
status: Open
review_date: TBD
```"""


def parse_metadata(comment_body: str) -> RiskMetadata | None:
    match = RESPONSE_RE.search(comment_body)
    if not match:
        return None

    fields: dict[str, str] = {}
    current_key: str | None = None
    for raw_line in match.group(1).splitlines():
        line = raw_line.rstrip()
        if not line.strip():
            continue
        field_match = FIELD_RE.match(line)
        if field_match:
            current_key = field_match.group(1).strip().lower().replace("-", "_").replace(" ", "_")
            fields[current_key] = field_match.group(2).strip()
        elif current_key:
            fields[current_key] = f"{fields[current_key]} {line.strip()}".strip()

    try:
        likelihood = int(fields["likelihood"])
        impact = int(fields["impact"])
    except KeyError as exc:
        raise ValueError(f"Missing required field: {exc.args[0]}.") from exc
    except ValueError as exc:
        raise ValueError("Likelihood and impact must be whole numbers.") from exc

    if not 0 <= likelihood <= 10 or not 0 <= impact <= 10:
        raise ValueError("Likelihood and impact must be between 0 and 10.")

    return RiskMetadata(
        category=fields.get("category", "TBD") or "TBD",
        owner=fields.get("owner", "TBD") or "TBD",
        likelihood=likelihood,
        impact=impact,
        mitigation=fields.get("mitigation", "TBD") or "TBD",
        status=fields.get("status", "Open") or "Open",
        review_date=fields.get("review_date", fields.get("review date", "TBD")) or "TBD",
    )


def newest_author_metadata(discussion: dict) -> RiskMetadata | None:
    author = discussion["author"]["login"]
    comments = discussion["comments"]["nodes"]
    author_comments = [comment for comment in comments if comment.get("author", {}).get("login") == author]
    for comment in reversed(author_comments):
        metadata = parse_metadata(comment["body"])
        if metadata:
            return metadata
    return None


def discussion_has_marker(discussion: dict, marker: str) -> bool:
    bodies = [discussion.get("body", "")]
    bodies.extend(comment["body"] for comment in discussion["comments"]["nodes"])
    return any(marker in body for body in bodies)


def next_risk_id(register_text: str) -> str:
    highest = 0
    for line in register_text.splitlines():
        match = ROW_RE.match(line)
        if match:
            highest = max(highest, int(match.group(1)))
    return f"R-{highest + 1:03d}"


def markdown_cell(value: str) -> str:
    return " ".join(value.replace("|", "\\|").split())


def append_risk(register_text: str, risk_id: str, discussion: dict, metadata: RiskMetadata) -> str:
    score = metadata.likelihood * metadata.impact
    risk_link = f"[{markdown_cell(discussion['title'])}]({discussion['url']})"
    row = (
        f"| {risk_id} | {risk_link} | {markdown_cell(metadata.category)} | "
        f"{markdown_cell(metadata.owner)} | {metadata.likelihood} | {metadata.impact} | "
        f"{score} | {markdown_cell(metadata.mitigation)} | {markdown_cell(metadata.status)} | "
        f"{markdown_cell(metadata.review_date)} |"
    )

    lines = register_text.splitlines()
    insert_at = len(lines)
    for index, line in enumerate(lines):
        if line.startswith("## Status Values"):
            insert_at = index
            while insert_at > 0 and not lines[insert_at - 1].strip():
                insert_at -= 1
            break

    updated = lines[:insert_at] + [row, ""] + lines[insert_at:]
    return "\n".join(updated).rstrip() + "\n"


def sync_register(discussions: list[dict]) -> tuple[bool, list[str]]:
    register_text = REGISTER_PATH.read_text(encoding="utf-8")
    added: list[str] = []

    for discussion in discussions:
        if discussion["url"] in register_text:
            continue

        try:
            metadata = newest_author_metadata(discussion)
        except ValueError as exc:
            if not discussion_has_marker(discussion, INVALID_MARKER):
                add_discussion_comment(discussion["id"], invalid_body(discussion["author"]["login"], str(exc)))
            continue

        if not metadata:
            if not discussion_has_marker(discussion, PROMPT_MARKER):
                add_discussion_comment(discussion["id"], prompt_body(discussion["author"]["login"]))
            continue

        risk_id = next_risk_id(register_text)
        register_text = append_risk(register_text, risk_id, discussion, metadata)
        added.append(f"{risk_id}: {discussion['title']}")

    if added:
        REGISTER_PATH.write_text(register_text, encoding="utf-8")
    return bool(added), added


def create_pr(added: list[str]) -> None:
    branch = os.environ.get("RISK_REGISTER_BRANCH", "bot/sync-risk-discussions")
    title = os.environ.get("RISK_REGISTER_PR_TITLE", "\U0001f9fe Add risks from GitHub Discussions")
    base_branch = os.environ.get("RISK_REGISTER_BASE_BRANCH") or os.environ.get("GITHUB_BASE_REF") or "main"
    body = "This automated PR adds completed risk discussions to the risk register.\n\n"
    body += "\n".join(f"- {item}" for item in added)

    run(["git", "config", "user.name", "github-actions[bot]"])
    run(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
    run(["git", "checkout", "-B", branch])
    run(["git", "add", str(REGISTER_PATH)])

    diff_check = run(["git", "diff", "--cached", "--quiet"], check=False)
    if diff_check.returncode == 0:
        return

    run(["git", "commit", "-m", title])
    run(["git", "push", "--force-with-lease", "origin", branch])

    existing = run(["gh", "pr", "view", branch, "--json", "url", "-q", ".url"], check=False)
    if existing.returncode == 0 and existing.stdout.strip():
        print(f"Updated existing PR: {existing.stdout.strip()}")
        return

    run(
        [
            "gh",
            "pr",
            "create",
            "--base",
            base_branch,
            "--head",
            branch,
            "--title",
            title,
            "--body",
            body,
        ]
    )


def main() -> None:
    owner, repo = repository_parts()
    category_name = os.environ.get("RISK_DISCUSSION_CATEGORY", "Risks")
    category_id = risk_category_id(owner, repo, category_name)
    discussions = open_risk_discussions(owner, repo, category_id)
    changed, added = sync_register(discussions)
    if changed:
        create_pr(added)
    else:
        print("No completed risk discussions to add.")


if __name__ == "__main__":
    main()
