Pending much owrk around the support portal and trema config:

* AWS Signing and Submission
* Daily holder backups (see CRONs to be migrated onto GitHub wit hte IAM permissions)

    * get assets from BTstellarToml (gets called by CloudScheduler at 0 UTC)
    * create CloudWatch events for each code
    * each CloudWatch calls Lambda
    * lambda function to: SEE NOTES
    * implement reading back from S3

- Streamline Dynamo

    * Separate imported from legacy shareholder DBs
    * Way to allow searching and display from legacy holdings properly registered but not on chain
    * Lambda to move from imported to legacy

- Automate Distribution of Legacy Share (completed)

    * Connect Dynamo to legacy DB
    * Build transaction generation functionality
    * Check PII item exists
    * Signing in Lambda
    * Send to network and confirm receipt
    * Remove legacy shareholding record

- Keygen

    * Configure Secrets Manager medium signer for the distributor account
    * Decide whether or not to implement key rotation
    * See how Franklin Templeton did it  (but here we know thry custody it)
