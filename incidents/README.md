## Cloud access inventory and review

Create a private inventory and public tracking issue for AWS/cloud access governance without exposing sensitive account details.

The goal is to make sure the project knows which cloud accounts, identities, credentials, and permissions exist; who owns them; whether they are still needed; and how they would affect incident detection, investigation, containment, and recovery.

### Inventory scope

- [ ] Inventory all cloud accounts and identities currently in use, including AWS accounts, human users, service accounts, console access, API access, and cross-account access.
- [ ] Inventory all credentials and access paths, including API keys, access keys, tokens, long-lived credentials, and temporary or session-based access.
- [ ] Inventory all accounts that can access protected data.
- [ ] Inventory all non-human and automation access, including CRON jobs, automated workflows, deployment systems, monitoring, logging, alerting systems, and third-party services.
- [ ] Inventory all backup, archival, or recovery access paths.
- [ ] Store the sensitive inventory in a private operational record.

### Admin account review

- [ ] Identify all admin accounts.
- [ ] Treat any account that can create accounts, grant permissions, or rotate credentials as an admin account.
- [ ] Treat any account that can access protected data as requiring elevated review.
- [ ] For each admin account, document the owner, business purpose, and whether the access is still needed.
- [ ] Remove or reduce unnecessary admin access.
- [ ] Confirm that admin accounts use MFA.
- [ ] Confirm that root or owner-level accounts are separately protected.

### Credential review

- [ ] Record the last rotation or review date for each credential.
- [ ] Record whether each credential is still active.
- [ ] Confirm each credential has a known owner.
- [ ] Confirm each credential has a documented business purpose.
- [ ] Confirm each credential has least-privilege permissions.
- [ ] Identify stale, unused, or unnecessary credentials.
- [ ] Remove stale or unused credentials.
- [ ] Rotate credentials that are overdue.
- [ ] Establish a recurring credential rotation and review cadence.

### Access-policy review

- [ ] Review each account’s effective permissions.
- [ ] Review what protected data each account can reach.
- [ ] Review whether access is read-only or write-capable.
- [ ] Review whether permissions match the current operational need.
- [ ] Review whether any account can alter security-critical controls, including logs, monitoring, or security settings.
- [ ] Review whether any account can manage identities or credentials, including users, service accounts, and API keys.
- [ ] Review whether any account can assume roles across accounts.
- [ ] Review whether any public or shared credentials exist.
- [ ] Remove or reduce permissions that are broader than needed.

### Incident response connection

- [ ] Map accounts to the incident response program.
- [ ] Identify which accounts could be involved in detecting, investigating, containing, or recovering from breaches.
- [ ] Identify which accounts could affect protected data during an incident.
- [ ] Document the logs needed to detect misuse of each account.
- [ ] Identify where access logs are stored.
- [ ] Identify who reviews access logs.
- [ ] Identify how suspicious access is escalated.
- [ ] Document response procedures for compromised admin accounts, service accounts, and exposed API keys.
- [ ] Confirm that incident responders know where the private access inventory is stored.

### Review cadence

- [ ] Establish recurring review cadences for accounts, admin access, service accounts, credentials, cross-account access, and protected-data access.
- [ ] Document when each review occurs.
- [ ] Document who performed each review.
- [ ] Document what changed after each review.
- [ ] Document any unresolved findings.
- [ ] Track unresolved findings until they are resolved, accepted, or assigned a follow-up owner.

### Public issue safety

- [ ] Do not publish sensitive identity details, including usernames, privileged-account emails, or account names that create security risk.
- [ ] Do not publish secrets or credential details, including API keys, access keys, tokens, passwords, or password-history details.
- [ ] Do not publish detailed permission maps if they would help an attacker.
- [ ] Publicly document that the private inventory exists.
- [ ] Publicly document that the inventory is reviewed on an appropriate cadence.
- [ ] Keep the sensitive inventory in a private operational record.
- [ ] Keep the public issue focused on policy, cadence, and evidence of review.
