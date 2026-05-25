# Risk Registry

This registry tracks operational risk by control surface so incident response, access review, vendor review, and data-retention work account for every place where company, issuer, investor, or regulatory data can enter, move, or be changed.

| Control surface | Primary risk | Current control question | Follow-up |
| --- | --- | --- | --- |
| GitHub | Source, workflow, and documentation changes could alter production behavior, compliance records, or operating instructions without adequate review. | Which repositories, branches, actions, secrets, and deploy keys can affect regulated records or production systems? | Inventory repositories and GitHub Actions with access to production, AWS, or investor/issuer data. |
| AWS | Lambda, S3, DynamoDB, Secrets Manager, CloudWatch, IAM, and signing/submission workflows can process or expose regulated records. | Which IAM principals, functions, buckets, tables, logs, and secrets can create, read, update, submit, or delete investor, issuer, holder, or SEC filing data? | Map AWS resources by data class, owner, retention rule, and break-glass access path. |
| Discord communications | Informal support or internal discussion can create untracked instructions, incident evidence, personal information, or issuer/investor communications. | Is Discord allowed for operational decisions, customer support, issuer support, or incident coordination? | Define allowed use, retention expectations, escalation paths, and what must be copied into the system of record. |
| Zoho legacy pages and bookings | Legacy CRM, booking, or intake pages can collect or route issuer/investor information outside the current control set. | Which Zoho forms, pages, booking links, automations, and data stores are still live or reachable? | Decide whether each Zoho surface is retired, read-only, or still controlled; document routing and retention. |
| Investor app secure intake | Investor onboarding and account workflows can collect identity, banking, tax, accreditation, authorization, and other sensitive records. | Which app screens, APIs, storage locations, logs, and support workflows receive investor-submitted data? | Maintain an intake data-flow diagram from submission through storage, review, export, deletion, and incident response. |
| Website forms | Public forms can receive personal information, issuer leads, support requests, or regulated instructions without authentication. | Which website forms exist, where do submissions go, and who can access them? | Inventory forms, destinations, spam/fraud controls, consent language, and deletion procedures. |
| Beta website forms | Beta forms may bypass production controls, notices, access review, monitoring, or retention policies. | Are beta forms collecting real data or only test data? | Mark every beta endpoint as disabled, test-only, or production-controlled before public use. |
| IssuerLink company-originated intake | Issuer-originated records and authority assignments can affect shareholder lists, insider status, SEC credentials, and corporate reporting. | Which issuer-provided submissions are authoritative enough to change records or trigger filings? | Define issuer authentication, approval, audit logging, and rollback procedures for each IssuerLink action. |
| EDGAR Next beta/adoption | SEC credentialing and filing authority changes can create access, submission, and evidence gaps during migration. | Who holds EDGAR Next credentials, who can delegate authority, and how are filings approved and retained? | Track EDGAR Next adoption status, role assignments, filing approval evidence, and revocation procedures. |
| Issuer email intake | Allowing issuers to email instructions or records can create CRM, marketing, recordkeeping, and authentication obligations. | Can issuers email operational instructions, documents, or investor data to the company, and what mailbox is authoritative? | Decide whether issuer email is accepted; if yes, designate the CRM or record system, retention rule, marketing opt-in treatment, and verification procedure. |
| AI tools | Team members may disclose customer PII, investor records, issuer records, credentials, or other confidential regulated data by pasting it into AI prompts or uploads. | Which AI tools, browser extensions, IDE assistants, meeting assistants, and document assistants are allowed for company work, and what data may they receive? | Publish an AI-use rule that prohibits submitting customer or regulated data unless an approved controlled workflow exists; require redaction of sensitive details before AI use. |

## Review checklist

- Confirm every control surface has an owner and system of record.
- Confirm whether the surface can receive personal information, investor records, issuer records, banking data, tax data, SEC credentials, or filing instructions.
- Confirm access review frequency and evidence location.
- Confirm retention and disposal rules for records, logs, exports, and support copies.
- Confirm incident-response contacts and escalation path.
- Confirm whether marketing or CRM obligations apply to communications captured through that surface.
