---
title: "Syndicate Update #1: Introducing TAD3"
date: 2023-11-02 12:43:17
layout: post
permalink: "/blog/post/syndicate-update-1-introducing-tad3/"
author: "John Wooten"
original_url: "https://www.blocktransfer.com/blog/post/introducing-transfer-agent-depository"
status: "publish"
categories:
 - "Syndicate Updates"
tags:
 - "Blockchain"
 - "Asset Management"
 - "Security"
 - "Decentralization"
 - "Innovation"
 - "Compliance"
---
### Team Members: 1

### Payroll Annualized: $0

This is something from the origin story of DRS.

The [Dr. Trimbath](https://twitter.com/SusanneTrimbath) [interview](https://www.youtube.com/watch?v=_6On5Rd3hmM) with No Safe Bets brings up:

In 1971, there was a group called the Banking And Securities Industry Committee...

These BASIC bankers got together and argued against creating something called

the transfer agent depository which would have given us direct registration back in 1971.

But instead, we were given the Depository Trust Company.
— Bibic at [WhyDRS.org ↗](https://www.whydrs.org/)

Prerequisite Listening: [Direct Registration System Provenance](https://nosafebets.com/2021/10/03/super-hero-origin-story-of-the-direct-registration-system-a-transcription). TLDR: Wall Street gets all your money.

According to the U.S. Securities and Exchange Commission:
The transfer agent depository ("TAD" ) would replace the certificate with computerized stockowner lists... which would serve as both the issuer's stock records and the shareowner's evidence of ownership.

SEC commenters supported the TAD. They thought the only investors should be registered investors (not interchangeable with [book entry](https://www.whydrs.org/) ). They wanted a world without a [convoluted, oligopolic, and opaque trading system](https://blocktransfer.com/.well-known/yellowpaper.pdf).

## Beginnings

Block Transfer started at an [online Atlanta Web3 hackathon](https://www.youtube.com/watch?v=Z8apvkhmhUo&list=PLWUFvhKuc_5trr9i5vEpdWZ6ZNZzHM3Nb&index=6). I was trading international forex markets 22 hours a day at the time, using [polyphasic uberman](https://youtu.be/rGNgWqQcrs0). I needed to do a "restart" because I decided to get a full night's sleep for finals. That meant staying up for 36 hours before starting my revolving 20-minute naps.

I think the exam was on a Wednesday, and the hackathon was the coming weekend. So I started the extended wake period 35 hours before the hackathon's closing ceremony. The hackathon was great, and it resulted in our [first Block Transfer implementation](https://github.com/blocktransfer/TAD2)

Soon after, we were graciously thrust into [Georgia Tech's InVenture Prize](https://youtu.be/S75IvkicWD8). Ever since the campus guide told me about the event during a high-school visit, I'd wanted to present. The process also introduced us to a key early advisor.

Preparation for the competition included three rounds of pitch competitions, the latter two to a panel of judges. After qualifying for finals, we went through dozens of pitch practice session with those judges, each time narrowing my idea down.

Around the same time, I also applied to other college student business pitch competitions. I further refined my idea here, and even won $5,000 from Entrepreneurs' Organization and $2,000 from US Bank.

All this pitching made me very focused on money. Combined with bona fide prodding from mentor sessions during Tech's [CREATE-X Startup Launch program](https://www.youtube.com/watch?v=54cW4Q68tGk&list=PLWUFvhKuc_5trr9i5vEpdWZ6ZNZzHM3Nb&index=4), we tried to close our first client in the summer of 2021 with an improved Ethereum implementation.

Talks went well with that CFO, but cost savings alone weren't enough to drive a close with [this level of implementation](https://www.youtube.com/watch?v=W-3dCGrWnLs&list=PLWUFvhKuc_5trr9i5vEpdWZ6ZNZzHM3Nb&index=4). I'm thankful for that, looking back. I think it would have been two months tops before we got an SEC non-compliance letter, if we took on the firm.

I realized that gas costs for a stock transfers on Ethereum would be at least $10 each, and significantly more for trades. To fix this problem, we planned to scale the Ethereum implementation with "level 2" daily transaction batches, using Arbitrum.

But any netting would [facilitate counterparty risk](https://www.youtube.com/watch?v=544BAtk2KLg&list=PLWUFvhKuc_5trr9i5vEpdWZ6ZNZzHM3Nb&index=22) (albeit less so with crypto) and, more importantly, slow down clearing to T+1:(## TAD2

So we set off looking for another blockchain. I settled on my three most important network considerations after considerable protocol analysis, comparisons, and brainstorming: (in order of importance)

1. Cost: Cost per transaction is and always will be a number one value metric for me. Per-trade costs directly impact investor returns. They are the one thing we can directly control to facilitate building real savings and retirements for masses of people.

1. Speed: I come from day trading. I regret sacrificing joyful instantaneous trading and limited market hours that squeeze most US volume from 9am to noon. But markets were [originally given trading hours](https://youtu.be/YUwqzeaR1lA) due to lack of buyer interest. That's not a problem in an increasingly global world with better online connection than ever.
1. **Impact**: We were unbelievably surprised to learn that Stellar cared so much about comprehensive global inclusion. I first learned about Stellar in 2017 when I [bought its nature currency at $0.035](https://youtu.be/rkB0BbIWG9k). I've always felt excluded from the financial system. When I was a pre-teen, I built an RPG with a video game maker. When publishing onto Steam, they asked for my bank account and routing numbers. When I asked my parents, they wouldn't share the details because "people will steal your money." Talk about trusting the financial system. Without much leverage, I moved on and eventually got [my first job at Subway](https://youtu.be/Xa-HJNnTi-c). I have them to thank for the muscle memory to grab things behind me without looking. My manager wasn't the nicest guy. I was okay with that because they were letting me work illegally at 15. But a lot of pressure started mounting after about a year there, when so many of my coworkers left that I was working open to close completely alone. I decided that the only way to take control of my financial future was to take it into my own hands. For the next six months, I spent every waking hour outside of work or school researching the stock market. I even made my first few investments. I had losers, some decent investments in NVIDIA and AMD, and a few stocks in-between. When summer rolled around, I turned in my two-week notice. I quit my job to trade stocks full-time. Just one small problem: I didn't have a brokerage account. I did all my initial testing with my Dad's broker. But he didn't live with me, plus his broker didn't have a very good trading interface. Luckily, my Mom set me up with her Fidelity. Sadly, my home relations were not great at the time. Every morning I had a problem logging into Fidelity, which was surprisingly often, I had to either disrupt my Mom's conference calls or watch hopelessly as the market ripped away without me (I didn't know about UTMAs at the time). But at the end of that summer, I discovered Ethereum. A solution, I thought![I spent the rest of the year trading](https://youtu.be/PNPM50umpTk) the [same technical analysis patterns](https://youtu.be/0mTU0x8Saak) in crypto—no age verification required. Imagine that Web3 experience, but for any modern financial institution—and especially for US stock brokers. Think about what your world would be like without quality, accessible investment opportunities. Would you still save for retirement? It's a lot harder without the [miracle of compounding](https://youtu.be/iNUFt2HUXkQ). That's a daily reality for over 7 billion people, many of whose best investment option is a metal roof or deadly weapon. What if we gave them access to the most advanced, developed, and liquid capital market the world has ever seen?

Stellar also has some other pretty cool things, all built directly into the protocol level. That means you don't need to write a smart contract for any of our current features, which historically [introduce significant security risks](https://en.wikipedia.org/wiki/The_DAO), even for the best teams.

That background was up to 2021. I spent the next two years learning to use Stellar. Personally, I never thought I'd code. I remember during my first blockchain startup thinking, "I'll never need to learn coding. I'll just hire developers with all the money I'll make trading stocks." I seriously doubt we'd be here today if I did outsource to a development team early on. Thankfully, good smart contract developers were too expensive for me at the time, so I learned how to code at Georgia Tech.

## Launch

We got our inaugural client in June, finished processing SEC registration papers for them in July, and started onboarding their investors upon receipt of a final cap table in September. We've [onboarded 6 investors](https://stellar.expert/explorer/public/asset/1984803ORD-GDRM3MK6KMHSYIT4E2AG2S2LWTDBJNYXE4H72C7YTTRWOWX5ZBECFWO7-2?asset%5B%5D=1984803ORD-GDRM3MK6KMHSYIT4E2AG2S2LWTDBJNYXE4H72C7YTTRWOWX5ZBECFWO7-2) out of the 25 provided. There is currently a [pending stock revocation](https://www.issuers.info/1984803/DOC/2023-10-18_Revocation.pdf) for 12 investors the company claims do not actually own shares.

When [this client](https://www.issuers.info/1984803/) first reached out to us, we thought they were a relatively large marketing company. But it turns out they are a small business—which is fine! Markets and stock ownership records 100% do need to exist for all businesses. If you plan to scale your business, it's very important to get your stock accounting right from day one. I've heard nightmare stories of VCs finding out three investment rounds later that they actually own another 250,000 shares per an early contract. Notwithstanding, they haven't yet paid us any communicated fees aside from an [~7% equity stake](https://stellar.expert/explorer/public/tx/a22b7fa63af4f45cdbab94170d3349f9d5cf4a3df58dacd5704a92ee136a2379). They told us that this was due to lack of funds on a call dated 23 Oct 2023.

## Next

If you visited the last link, then you saw the actual transaction I was talking about when I mentioned our equity stake. It was a payment of 5 million shares from our Stellar "distributor account" to our treasury account. If you looked closely you can see the amount we paid for the shares in the memo and the "claimable" date we elected internally to not transfer our shares until, to both align our incentives with their long-term objectives and prevent us from dumping shares on their developing investor-base.

That's the power of Web3. Anyone can confirm information about a stock without worrying about expensive level 2 access fees, data platform access fees, or specialized market information consolidators. You can just reference the blockchain for all your needs in real time. And the transaction, which executed in about 5 seconds, cost only 0.0001 XLM, or $0.0012 today.

#### TAD3

That's just the tip of the iceberg for what we're calling our "Web3 Transfer Agent Depository" or TAD3 for short. We've conducted extensive due diligence on the regulatory implications of TAD3. Despite presenting our system to even the most executive individuals at or formerly at the Securities and Exchange Commission, we've concluded that TAD3 falls outside of the current, relatively limited set of regulations on legacy transfer agents. We've always been [registered as a transfer agent with the SEC](https://www.sec.gov/edgar/browse/?CIK=1846058), but we're happy to change filer types if the SEC thinks TAD3 should be explicitly classified as the transfer agent depository.

One particularly important aspect of TAD3 is the ability for registered investors to trade with each other through Stellar's native decentralized exchange, the SDEX. Block Transfer [conducts KYC/AML checks](https://blocktransfer.com/compliance/user/aml-policy) for all accounts. The SDEX lets these investors trade TAD3 assets on a global, decentralized limit order book. Under the hood, investors [use cryptography](https://www.blocktransfer.com/blog/post/medallion-signature-guarantee-stamps) to sign bid and ask quotes which get stored on the blockchain and matched every ledger [based first on price and then time](https://developers.stellar.org/docs/encyclopedia/liquidity-on-stellar-sdex-liquidity-pools).

We continually monitor all accounts for suspicious transfer or trading activities. With that said, it's worth explaining a little bit about what accounts look like in TAD3. All Stellar accounts get identified by a "public key" that looks like "GDRM3MK6KMHSYIT4E2AG2S2LWTDBJNYXE4H72C7YTTRWOWX5ZBECFWO7." Those public keys aren't very easy to share, so we give users a random permanent account ID that looks like BIYES3WTN. On the backend, this [resolves to the full public key](https://api.blocktransfer.com/federation?q=BIYES3WTN&type=plus). If you visited the equity transaction link, then you might have noticed that the two accounts mentioned are identified on the ledger by their public keys. Those public keys, and thus their associated transactions, are the only user information stored on the blockchain.

It's worth pausing for a moment to talk a little more about Stellar.

### Brief Stellar History

Stellar went live one month after Ethereum in 2015. The SDEX [has been there since day one](https://github.com/stellar/stellar-core/releases/tag/v0.1).

The team behind Stellar [split from Ripple](https://dailycoin.com/jed-mccaleb-why-ripple-labs-despise-xrp-founder/) in 2014 because they wanted to focus on empowering global citizens to access financial markets, not profiting from big banks (the article linked was originally titled "Jed McCaleb: XRP and XLM Visionary or Disaster Artist?" ). This decision shows in every aspect of Stellar.

In contract with other [truly decentralized blockchains](https://stellarbeat.io/), Stellar does not distribute transaction fees or any other compensation to miners or validators, thanks to its [unique consensus protocol](https://www.scs.stanford.edu/17au-cs244b/notes/scp.pdf). This keeps transaction costs down.

Stellar can currently process [up to 1,000 transactions per ledger](https://coinmarketcap.com/community/articles/64919d9be186a85d04cb478f/). That lets investors pack the blockchain with as many stock gifts, buy offers, or proxy votes as they can click away on their phones at once.

Lastly, Stellar is incredible dedicated to [global financial inclusion](https://stellar.org/blog/ecosystem/decentralife-neema-adam). There are immense benefits to opening US investment markets to the world, direct foreign markets to Americans, and everything in-between (e.g. more eyeballs on stock tickers). TAD3 fundamentally connects a growing capitalistic world with a fair market for capital. We envision a future where, after proper SEC filings, a company can "go public" through an SDEX sell offer (most investors don't know that "being public" really just means that you report timely financial statements to the SEC). That why we connect investors and issuers with a standardized nonprofit global financial system.

### We Will Comply

The SEC is well within their rights to ask for programmatic access to our internal records to resolve a suspicious public key to its full internal PII record. We will grant them access to such a system, not unlike the [present CIP](https://www.sec.gov/rules/2003/04/customer-identification-programs-broker-dealers). We built TAD3 to help investors for their entire investing career from start to peaceful bequeathment. Our general approach so far has been modeling the Syndicate based on the past 100+ years of broker regulations. TAD3 will either comply with all future transfer agent regulations, or we'll help build them ourselves.

Sources

[SEC Report on Transfer Agent Depository](https://www.google.com/books/edition/Final_Report_of_the_Securities_and_Excha/J33QAAAAMAAJ)

Read Next: [Empowering Investors](https://www.blocktransfer.com/blog/post/investor-to-investor-direct-trading) - Learn how TAD3 enables direct trading with zero banks, brokers, etc.
