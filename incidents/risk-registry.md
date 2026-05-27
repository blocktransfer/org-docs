


| Control surface | Primary risk | Current control question | Follow-up |
| --- | --- | --- | --- |
| AWS | Lambda, S3, DynamoDB, Secrets Manager, CloudWatch, IAM, and signing/submission workflows can process or expose regulated records. | Which IAM principals, functions, buckets, tables, logs, and secrets can create, read, update, submit, or delete investor, issuer, holder, or SEC filing data? | Map AWS resources by data class, owner, retention rule, and break-glass access path. |
| Discord communications | Informal support or internal discussion can create untracked instructions, incident evidence, personal information, or issuer/investor communications. | Is Discord allowed for operational decisions, customer support, issuer support, or incident coordination? | Define allowed use, retention expectations, escalation paths, and what must be copied into the system of record. |
| Zoho legacy pages and bookings | Legacy CRM, booking, or intake pages can collect or route issuer/investor information outside the current control set. | Which Zoho forms, pages, booking links, automations, and data stores are still live or reachable? | Decide whether each Zoho surface is retired, read-only, or still controlled; document routing and retention. |
|  [Forw ard - Looknig Nencerrent] Investor app secure intake | Investor onboarding and account workflows can collect identity, banking, tax, accreditation, authorization, and other sensitive records. | Which app screens, APIs, storage locations, logs, and support workflows receive investor-submitted data? | Maintain an intake data-flow diagram from submission through storage, review, export, deletion, and incident response. |

