# Backup Custodian GitHub Operational Sources

## Purpose

This draft scopes a migration of the 17Ad-7(f)(5)(ii) backup custodian arrangement to use GitHub as the controlled source for operational documentation needed to access electronic records and indexes.

## Rule Anchor

17 CFR 240.17Ad-7(f)(5)(ii) requires a registered transfer agent using electronic storage media or micrographic media to maintain an escrow arrangement covering the technical and operational materials needed to access retained records.

Key rule phrases for this design:

- "in escrow with an independent third party"
- "keep current"
- "information necessary to access records and indexes"

## Draft Arrangement

GitHub will serve as the operational-source system of record for the backup custodian package. The repository should hold the current documentation, source references, configuration maps, access procedures, record-index descriptions, and recovery instructions needed to understand and access the electronic records management system.

The independent backup custodian or escrow agent should receive access to the GitHub repository, or to a repository export, under a written arrangement that confirms the custodian can furnish the current package promptly upon request by the SEC, its designees, representatives, and the appropriate regulatory agency.

## Operational Source Package

The GitHub package should include:

- Physical and logical format descriptions for electronic storage systems
- Field-format descriptions for each record type
- Source-code repository references and release identifiers
- Record index structure and lookup procedures
- System architecture and dependency documentation
- Environment and configuration documentation
- Access, authentication, and recovery procedures
- Export procedures for records and indexes
- Evidence of periodic package review and update
- Custodian contact and escalation details

## GitHub Controls

The repository should be managed with controls that support currency, integrity, and retrieval:

- Protected default branch
- Required pull request review for material changes
- Signed commits where practical
- Release tags for custodian package snapshots
- Repository exports or archived releases delivered to the custodian
- Access review for custodian and internal maintainers
- Issue or project tracking for required updates
- Audit trail preserved through Git history and GitHub activity

## Custodian Delivery Model

The arrangement can use one or both of these delivery paths:

1. Direct custodian access to the private GitHub repository with read-only permissions.
2. Periodic release archive delivered to the custodian and identified by release tag, commit hash, and date.

The preferred model is to maintain the repository as the working source and provide periodic release archives as the formal escrow copy.

## Review Cadence

Review and refresh the package:

- After material changes to recordkeeping systems
- After changes to field formats, indexes, storage locations, or recovery procedures
- After changes to source-code repositories or deployment architecture
- At least annually, even if no material changes occurred

## Open Draft Points

- Identify the independent custodian or escrow agent.
- Confirm whether direct GitHub access is acceptable, or whether only release archives should be delivered.
- Define the release-tag naming convention.
- Define who signs the undertaking and where it is filed.
- Define evidence retained for each custodian package update.

## Source

- 17 CFR 240.17Ad-7(f)(5)(ii), Record retention.
