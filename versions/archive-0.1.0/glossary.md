# Glossary

## Account rectification

Account rectification is the process of correcting an investor account record after an error, compromise, key loss, or unauthorized activity is identified. Rectification may include confirming the investor's identity, documenting the issue, restoring accurate account information, replacing compromised access credentials, and recording any corrective transfer or administrative action.

## Investor account

An investor account is the record used to associate an investor with their holdings, identity information, communications, and account permissions. The account record should distinguish between legal ownership, operational access, and technical wallet control.

## Legacy investor PII database

The legacy investor PII database is the imported source database containing investor personally identifiable information from prior systems or records. It is maintained on the airgapped recovery system and should be treated as sensitive source material for verification, reconciliation, and recovery workflows.

## Investor PII database

The investor PII database is the formatted database of investor information used for current operational, compliance, and recovery processes. It is maintained on the airgapped recovery system and should reflect normalized investor records derived from approved source materials, including the legacy investor PII database when applicable.

## Private key

An investor's private key is the cryptographic secret that can authorize blockchain transactions from a wallet or account. Anyone with the private key can generally control the assets associated with that key, so it must be protected from disclosure, copying, and unauthorized storage.

## Public key

A public key is the non-secret identifier derived from a private key. It can be shared to identify a wallet, verify signatures, or receive assets, but it should not be treated as proof that the person presenting it controls the account unless a valid signature or other verification is provided.

## Seed phrase

A seed phrase is a human-readable backup phrase used to restore a wallet and regenerate its private keys. A seed phrase should be treated with the same sensitivity as the private keys it can recover. If a seed phrase is exposed, the related wallet should be considered compromised.

## Wallet

A wallet is software, hardware, or another controlled system used to store keys and sign transactions. A wallet may be controlled directly by an investor, by a custodian, or through a managed operational process.

## Custodial account

A custodial account is an arrangement where a custodian controls the private keys or transaction authority on behalf of the investor. The investor may retain legal ownership of the assets while the custodian controls operational access.

## Non-custodial account

A non-custodial account is an arrangement where the investor or their authorized agent controls the private keys. In this model, loss or exposure of a private key or seed phrase can directly affect the investor's ability to access or protect assets.

## Key rotation

Key rotation is the process of replacing an old or exposed key with a new key and moving account authority or assets to the new control structure. Rotation is commonly used after suspected compromise, employee access changes, or recovery from poor key handling.

## Compromise

A compromise occurs when an unauthorized person may have accessed, copied, used, or influenced credentials, keys, systems, or account records. A suspected compromise should be documented and assessed even if no confirmed asset movement has occurred.

## Recovery

Recovery is the process of restoring access to an account after loss, compromise, or administrative error. Recovery should include identity verification, evidence review, approval controls, and records showing what was changed and why.

## Transaction authorization

Transaction authorization is the act of approving and signing a blockchain transaction or administrative account action. Authorization should be tied to the correct investor, account authority, and documented approval path.
