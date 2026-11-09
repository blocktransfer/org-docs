# AWS Vendor Analysis

## Purpose

This document records the vendor analysis for Amazon Web Services as an infrastructure provider in support of incident response, Regulation S-P readiness, and vendor oversight.

## Vendor

- Vendor: Amazon Web Services, Inc.
- Service category: Cloud infrastructure and platform services
- Intended use: Hosting, storage, networking, monitoring, and related operational infrastructure
- Data sensitivity: May include confidential business information, security logs, operational records, and customer-related records depending on the deployed workload

## Business Need

AWS provides scalable infrastructure, security controls, availability tooling, and operational services that would be difficult to reproduce internally. Use of AWS should be limited to approved workloads with documented access controls, logging, backup expectations, and data retention requirements.

## Risk Considerations

- Unauthorized access to hosted systems or stored data
- Misconfigured storage, identity, network, or logging controls
- Service outage or regional availability event
- Insufficient monitoring or delayed incident detection
- Incomplete vendor documentation during incident response
- Data retention, deletion, or export gaps during offboarding

## Required Controls

- Use least-privilege IAM roles and accounts
- Require multi-factor authentication for privileged access
- Keep production workloads separated from development and test environments
- Enable centralized logging for security-relevant events
- Encrypt sensitive data in transit and at rest
- Maintain documented backup and recovery expectations for critical systems
- Review access periodically and remove access promptly when no longer needed
- Document the AWS services used by each production workload

## Incident Response Notes

During an incident involving AWS-hosted systems, preserve relevant logs before retention windows expire, identify affected accounts, regions, services, and workloads, and document any support case numbers opened with AWS. Access changes, containment actions, and evidence collection should be recorded in the incident timeline.

## Review

- Owner: Operations
- Review cadence: At least annually or after a material infrastructure change
- Status: Draft
