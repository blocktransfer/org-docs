## Cloud access inventory and review

Create a private inventory and public tracking issue for AWS/cloud access governance without exposing sensitive account details.

### Inventory scope

- [ ] Inventory all cloud computing accounts currently in use.
- [ ] Inventory all AWS accounts involved in the project.
- [ ] Inventory all service accounts.
- [ ] Inventory all human user accounts.
- [ ] Inventory all console-access accounts.
- [ ] Inventory all accounts with API access.
- [ ] Inventory all accounts with cross-account access.
- [ ] Inventory all tokens used between accounts.
- [ ] Inventory all access keys.
- [ ] Inventory all API keys.
- [ ] Inventory all long-lived credentials.
- [ ] Inventory all temporary credentials or session-based access paths.
- [ ] Inventory all accounts that can access protected data.
- [ ] Inventory all accounts used for CRON jobs or automated workflows.
- [ ] Inventory all accounts used by deployment systems.
- [ ] Inventory all accounts used by monitoring, logging, or alerting systems.
- [ ] Inventory all accounts used by third-party services.
- [ ] Inventory all backup, archival, or recovery access paths.

### Admin account review

- [ ] Identify all admin accounts.
- [ ] Treat any account that can create other accounts as an admin account.
- [ ] Treat any account that can grant permissions as an admin account.
- [ ] Treat any account that can rotate credentials as an admin account.
- [ ] Treat any account that can access protected data as requiring elevated review.
- [ ] Document who owns each admin account.
- [ ] Document why each admin account exists.
- [ ] Document whether each admin account is still needed.
- [ ] Remove or reduce unnecessary admin access.
- [ ] Confirm that admin accounts use MFA.
- [ ] Confirm that root or owner-level accounts are separately protected.

### Credential review

- [ ] Record when each password was last changed.
- [ ] Record when each API key was last rotated.
- [ ] Record when each access key was last rotated.
- [ ] Record when each console-access token was last reviewed.
- [ ] Record whether each credential is still active.
- [ ] Record whether each credential is assigned to a known owner.
- [ ] Record whether each credential has a documented business purpose.
- [ ] Record whether each credential has least-privilege permissions.
- [ ] Record whether any credentials are stale or unused.
- [ ] Remove stale credentials.
- [ ] Rotate credentials that are overdue.
- [ ] Establish a recurring key-rotation cadence.

### Access-policy review

- [ ] Review what each account can access.
- [ ] Review what protected data each account can reach.
- [ ] Review whether access is read-only or write-capable.
- [ ] Review whether any account can modify logs.
- [ ] Review whether any account can disable monitoring.
- [ ] Review whether any account can change security settings.
- [ ] Review whether any account can create, delete, or alter users.
- [ ] Review whether any account can create, delete, or alter service accounts.
- [ ] Review whether any account can create new API keys.
- [ ] Review whether any account can assume roles across accounts.
- [ ] Review whether any public or shared credentials exist.
- [ ] Review whether permissions match the current operational need.

### Incident response connection

- [ ] Map accounts to the incident response program.
- [ ] Identify which accounts could be involved in detecting breaches.
- [ ] Identify which accounts could be involved in investigating breaches.
- [ ] Identify which accounts could be involved in containing breaches.
- [ ] Identify which accounts could be involved in recovering from breaches.
- [ ] Identify which accounts have access to protected data.
- [ ] Identify which logs are needed to detect misuse of each account.
- [ ] Identify where access logs are stored.
- [ ] Identify who reviews access logs.
- [ ] Identify how suspicious access is escalated.
- [ ] Identify what happens if an admin account is compromised.
- [ ] Identify what happens if a service account is compromised.
- [ ] Identify what happens if an API key is exposed.

### Review cadence

- [ ] Establish a recurring review cadence for all accounts.
- [ ] Establish a recurring review cadence for admin accounts.
- [ ] Establish a recurring review cadence for API keys.
- [ ] Establish a recurring review cadence for access tokens.
- [ ] Establish a recurring review cadence for service accounts.
- [ ] Establish a recurring review cadence for cross-account access.
- [ ] Establish a recurring review cadence for protected-data access.
- [ ] Document when each review occurs.
- [ ] Document who performed each review.
- [ ] Document what changed after each review.
- [ ] Document any unresolved findings.

### Public issue safety

- [ ] Do not publish account names if they create security risk.
- [ ] Do not publish usernames.
- [ ] Do not publish emails tied to privileged accounts.
- [ ] Do not publish API keys.
- [ ] Do not publish access keys.
- [ ] Do not publish tokens.
- [ ] Do not publish passwords or password-history details.
- [ ] Do not publish detailed permission maps if they would help an attacker.
- [ ] Publicly document that the inventory exists.
- [ ] Publicly document that the inventory is reviewed on an appropriate cadence.
- [ ] Keep the sensitive inventory in a private operational record.
- [ ] Keep the public issue focused on policy, cadence, and evidence of review.
