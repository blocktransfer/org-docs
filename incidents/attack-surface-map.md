# Attack Surface Map

## Purpose

This document maps the primary attack surfaces that may affect covered investor information, operational records, internal systems, and incident response readiness.

## Scope

The map covers systems, accounts, vendors, communications channels, and human workflows that could be used to gain unauthorized access, disrupt operations, or expose sensitive information.

## External Services

- Cloud infrastructure, storage, databases, and deployment services
- Domain registrar, DNS, email delivery, and authentication services
- Public websites, documentation sites, investor portals, and hosted forms
- Third-party collaboration, support, analytics, and monitoring tools
- Vendor support channels with administrative or diagnostic access

## Identity and Access

- Administrator accounts and privileged roles
- Shared operational inboxes and distribution lists
- Single sign-on, multi-factor authentication, and recovery workflows
- API keys, access tokens, service accounts, and automation credentials
- Onboarding, offboarding, and access review gaps

## Application and Data Surfaces

- Investor records, notices, subscription materials, and classification records
- Internal spreadsheets, financial records, and operational documents
- Application forms, upload flows, and document storage
- Source repositories, deployment pipelines, and configuration files
- Logs, exports, backups, and temporary working files

## Communications Surfaces

- Email conversations with investors, issuers, vendors, and service providers
- Calendar invitations, shared documents, and messaging platforms
- Public social, website, and repository activity
- Support requests, vendor tickets, and incident communications

## Human and Process Surfaces

- Phishing, impersonation, and social engineering attempts
- Manual handling of investor or issuer materials
- Approval workflows for payments, account access, and vendor requests
- Informal workarounds during urgent operations or incidents
- Delayed revocation of access after role or vendor changes

## Monitoring Signals

- Unusual login location, device, or authentication pattern
- Privileged role changes or new service credentials
- Unexpected data export, deletion, or sharing activity
- DNS, domain, email, or certificate changes
- Source repository, deployment, or infrastructure configuration changes
- Vendor notifications, abuse reports, or suspicious support activity

## Response Priorities

1. Identify the affected system, account, vendor, data set, and time window.
2. Preserve logs and records before retention windows expire.
3. Contain access by rotating credentials, disabling sessions, and reducing privileges.
4. Determine whether covered investor information or operational records were accessed, altered, or exposed.
5. Record decisions, evidence, notices, vendor contacts, and recovery actions in the incident timeline.

## Review

- Owner: Operations
- Review cadence: At least annually or after a material system, vendor, or workflow change
- Status: Draft
