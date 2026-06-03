# Sensitive Investor Information

> [!WARNING]
> The most important piece of investor information is your seed phrase (referred to as digital account certificate in other materials). This private key grants cryptographic access to all wallet assets held through a noncustodial app. It's the basis of all user authentication and should _never_ be shared with anyone, including BT team members. (We do not track a copy of any portion of your seed phrase.)

## Tier-1 Data

This information is independently of high priority and must be protected at all costs.

- Social Security number or other Tax ID.
- Driver's license or passport numbers.

Because of their sensitivity, this information uses tokenization in the PI database, alongside separate organizational storage and access controls within AWS. Protecting names and emails can help with this goal to prevent the easiest phishing attacks.

## Tier-2 Data

This information would be very suboptimal to be revealed in association with Tier-3 data.

- Blockchain wallet public keys.
- Mailing or physical investor addresses.
- Date of birth.
- Phone number.

Unfortunately, this is also the most common information included on reports to issuers for insider analysis. Birthdays can be approximated, but the other data must be shared for complete security holder identification on the stock list.

## Tier-3 Data

This encompasses all other metadata which may be stored about an investor, such as:

- Reinvestment preferences.
- Reg CF or A (Type 2) purchase limits.
- Trading restrictions.
- Beneficiary information (which should be an Account ID if it exists).

## Public Data

- Blockchain transactions associated with a pseudonymous public key.
- Account ID (which maps to public key).
- Basis for originating purchases (tied to public key and asset).
- Insider name (revealed per assigned PK) when performing sales under Rule 144.

## Pending Data

- Bank account and routing numbers.
- Other EFT tracking, which should also be tokenized.
- IP tracking or biometric data as needed.
- Support tickets and conversations.
