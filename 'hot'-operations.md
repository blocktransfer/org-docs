Pending much owrk around the support portal and trema config:

* AWS Signing and Submission
* Daily holder backups (see CRONs to be migrated onto GitHub wit hte IAM permissions)

    * get assets from BTstellarToml (gets called by CloudScheduler at 0 UTC)
    * create CloudWatch events for each code
    * each CloudWatch calls Lambda
    * lambda function to: 

        * gets state variables for file name
        * runs `getLedgerBals`
        * exports to S3 archive
             * extract values from `https://horizon.stellar.org/assets?asset_code=1984803ORD&asset_issuer=GDRM3MK6KMHSYIT4E2AG2S2LWTDBJNYXE4H72C7YTTRWOWX5ZBECFWO7`:

                 * NumUnrestricted = records.get("amount")
               * NumRestricted = records.get("claimable_balances_amount")
            * name file as:

                 * `{{closingDate = day--}}`/`CODE`-`START_LEDGER`-`END_LEDGER`-`NumUnrestricted`-`NumRestricted`-`NumContract`
        * get the numbers at the start of the function (call)



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
