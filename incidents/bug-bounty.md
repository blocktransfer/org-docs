# Bug Bounty

BlockTransfer welcomes responsible reports about security issues that could affect investor information, issuer records, regulated filings, production infrastructure, or the integrity of TAD3 workflows.

## Report a Vulnerability

Send reports to security@blocktransfer.com.

Do not open a public GitHub issue, discussion, pull request, Discord thread, or social media post for a vulnerability before BlockTransfer has reviewed and remediated it.

Include as much of the following as possible:

- A short description of the issue and affected system.
- The steps needed to reproduce the issue.
- The security impact, including whether investor, issuer, banking, tax, identity, account, filing, or credential data may be exposed or changed.
- Relevant URLs, request IDs, transaction hashes, screenshots, logs, or proof-of-concept code.
- Your contact information and preferred attribution name, if you want recognition.

## In Scope

Reports are most useful when they relate to:

- Unauthorized access to investor, issuer, holder, banking, tax, identity, or filing records.
- Authentication, authorization, session, wallet, or account-linking bypasses.
- Vulnerabilities that could alter shareholder records, transfer instructions, filings, or issuer authority.
- Exposure of secrets, credentials, private keys, signing keys, API tokens, cloud resources, logs, backups, or regulated records.
- Production TAD3, BlockTransfer, IssuerLink, and supporting automation used for regulated operations.
- Material weaknesses in incident response, retention, access control, or vendor data flows.

## Out of Scope

The following are normally out of scope unless they show a clear security impact:

- Spam, phishing, social engineering, or physical attacks.
- Denial-of-service testing, load testing, or resource exhaustion.
- Vulnerability scanner output without validated impact.
- Missing headers, cookie flags, or best-practice findings without an exploitable path.
- Issues that require access to a device, account, key, seed phrase, or credential you do not own.
- Public information, old marketing pages, or archived content that does not affect current systems or regulated records.

## Research Rules

Stay within these rules while testing:

- Use your own accounts, wallets, data, and assets.
- Stop testing and report immediately if you access data that is not yours.
- Do not view, copy, change, delete, exfiltrate, or retain investor, issuer, holder, banking, tax, identity, filing, credential, or private-key material.
- Do not interrupt production service, degrade availability, or run automated high-volume testing.
- Do not attempt persistence, lateral movement, privilege escalation beyond what is needed to demonstrate impact, or access to third-party systems.
- Do not publicly disclose the issue until BlockTransfer has had a reasonable opportunity to investigate and remediate it.

## Bounties and Recognition

BlockTransfer may provide discretionary rewards or public recognition for eligible reports based on severity, exploitability, report quality, and whether the issue affects regulated records or production systems.

Bounties are not guaranteed. Duplicate reports, low-impact findings, reports without enough detail to validate, and issues found by violating the research rules may be ineligible.

## Response

BlockTransfer will make a reasonable effort to acknowledge valid reports, investigate the issue, request clarification when needed, and coordinate remediation. Reports involving sensitive investor or issuer information receive priority handling under the incident-response process.
