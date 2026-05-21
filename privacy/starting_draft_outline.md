---
title: 248.9 Privacy Notice Delivery Templates
description: Template delivery language and implementation notes for privacy and opt-out notices under Regulation S-P.
sidebar_label: § 248.9 Delivery Templates
---

# 🦖 § 248.9 Privacy Notice Delivery Templates

:::note
This page tracks delivery mechanics for privacy notices and opt-out notices under 17 CFR § 248.9. It is separate from the § 248.30 incident-response and customer-notice workstream.
:::

## Purpose

17 CFR § 248.9 explains how required privacy notices and opt-out notices must be delivered. The core standard is that each consumer must be reasonably expected to receive actual notice, either in writing or electronically if the consumer agrees.

This page should collect reusable delivery templates for notices required elsewhere in Regulation S-P, including:

- Initial privacy notices
- Annual privacy notices
- Revised privacy notices
- Opt-out notices
- Short-form initial notices, where applicable

## Source Rule

- [17 CFR § 248.9 - Delivering privacy and opt out notices](https://www.law.cornell.edu/cfr/text/17/248.9)

## Scope

This page covers notice delivery mechanics only.

It does **not** decide:

- whether a notice is required;
- what the privacy notice must say;
- whether opt-out rights apply;
- whether a § 248.30 customer breach notice is required;
- whether a service-provider incident triggers the § 248.30 response program.

Those determinations should be handled in the related policy and incident-response pages.

## Delivery Methods

### Printed delivery

Use when notice is delivered by paper.

Template language:

```text
The notice was delivered in writing by [hand delivery / mail] to the consumer at [delivery location / last known address] on [date].
````

Implementation notes:

* Confirm the address source.
* Preserve delivery records.
* Link the notice version sent.
* Record any returned mail or failed delivery event.

### Electronic delivery

Use when the consumer has agreed to electronic delivery.

Template language:

```text
The notice was delivered electronically to the consumer at [email address / portal account / other electronic destination] on [date], consistent with the consumer's agreement to receive electronic notices.
```

Implementation notes:

* Confirm the consumer agreed to electronic delivery.
* Preserve the consent record.
* Preserve the delivery record.
* Preserve the notice version sent.
* Record any bounce, failure, or access issue.

### Website or portal delivery

Use only when the consumer can reasonably be expected to receive actual notice through the site or portal.

Template language:

```text
The notice was made available through [portal / website location] on [date]. The consumer was directed to the notice through [login flow / account message / email / other method].
```

Implementation notes:

* Website posting alone may not be enough unless the consumer is reasonably expected to receive actual notice.
* Keep evidence of the consumer-facing prompt or delivery path.
* Preserve screenshots or release records when appropriate.

## Notice Version Log

| Date | Notice Type            | Version | Delivery Method | Owner | Evidence |
| ---- | ---------------------- | ------- | --------------- | ----- | -------- |
| TODO | Initial privacy notice | TODO    | TODO            | TODO  | TODO     |
| TODO | Annual privacy notice  | TODO    | TODO            | TODO  | TODO     |
| TODO | Revised privacy notice | TODO    | TODO            | TODO  | TODO     |
| TODO | Opt-out notice         | TODO    | TODO            | TODO  | TODO     |

## Delivery Checklist

Before marking a notice as delivered, confirm:

* [ ] The notice type is identified.
* [ ] The consumer or customer population is identified.
* [ ] The correct notice version is attached or linked.
* [ ] The delivery method is documented.
* [ ] The delivery method supports a reasonable expectation of actual notice.
* [ ] Electronic delivery is supported by consumer consent, if used.
* [ ] Failed delivery events are logged.
* [ ] Records are retained with the Regulation S-P binder or index.

## Related Pages

* TODO: Initial privacy notice template
* TODO: Annual privacy notice template
* TODO: Revised privacy notice template
* TODO: Opt-out notice template
* TODO: § 248.30 incident-response customer notice
* TODO: § 240.17Ad-7(k) recordkeeping binder

## Open Questions

* [ ] Do any BlockTransfer workflows create a consumer relationship that requires an initial privacy notice?
* [ ] Do any workflows require an opt-out notice under §§ 248.7 and 248.10?
* [ ] Should electronic delivery consent be collected in the issuer portal, investor portal, or both?
* [ ] Where should notice delivery evidence be retained?
* [ ] Should failed delivery events create a follow-up task or exception record?

## Implementation TODOs

* [ ] Add current notice templates.
* [ ] Add delivery evidence examples.
* [ ] Add portal screenshot placeholders.
* [ ] Add record-retention mapping.
* [ ] Cross-link this page from the Regulation S-P binder index.

[1]: https://www.law.cornell.edu/cfr/text/17/248.9?utm_source=chatgpt.com "17 CFR § 248.9 - Delivering privacy and opt out notices."
