# Incident Response

BlockTransfer uses a combination of open-source community tools and independent team judgment to stop cyber security threats. These systems revolve around our organizational GitHub, and they primarily live in [this repository](https://github.com/blocktransfer/org-docs). The organization itself requires strong 2FA for members of the team to join and hence display the BlockTransfer badge on their profile once they are invited to "internally" contribute.

We have a loose definition of totality, since all our policies, procedures, and even trading data reside on public blockchain infrastructure or associated open-source codebases. While investor information itself has strict safeguarding policies, the design of systems around it, data patterns, and access mechanisms themselves are thoroughly and transparently documented in this site. Thus, the team designation makes it simple to track all participants who may possibly have access to decryption keys or storage physical locale of investor information.

All confidential information is stored on an air-gapped and encrypted computer held at the Principal Place of Business defined in our TA-1 form, on file with the Commission. It is also backed up in that location on an encrypted memory storage device. When information needs updating, the storage card is amended with the new data, which is physically transferred to the primary server.

Because the host of this data has no internet access, unauthorized access can only occur through both physical access and password authentication to either the data computer or backup drive. The team can detect this intrusion by the physical theft or other coercive access to either device. However, even upon the physical theft of the electronics, access without the encryption key should be impossible.

The encryption key for these devices differs from the blockchain signing keys discussed elsewhere. It is a unique string of information held mentally by the team and not otherwise recorded on backup media. In the event of force majeure, the entirety of the investor information can be recovered from the backup storage medium.

In the event of physical investor information intrusions, team members will first notify local law enforcement as to the attack. Team members will follow up with local contacts to determine if the perpetrator is caught, especially if they steal one or both of the encrypted systems. Team members will attempt to recover these devices.

In the event of forced reveal of investor information during a break-in, team members will attempt to recall as much about what information was confiscated or otherwise accessed without authorization. This written account will be made through the Notice Procedure for breaches, detailed below. It will act as the basis of a determination as to which customers have been revealed to the attacker.

For response, team members will make any reasonable and safe effort to prevent an intruder from stealing customer information. However, they are to remain compliant in extraction methods undertaken with deadly force or a weapon. Team members may or may not maintain their own firearm at the TA-1 address to thwart attackers.

Team members should only give attackers access to one form of the investor information, which should satisfy their need to steal such information. The other form (in whichever medium) must be retained (such as by not disclosing its hiding place or otherwise storing through a separate means of custody) so as to allow the restoration of operations post-attack. This copy is also needed for the investor notice procedures.

## Notice Procedure

Team members will open a new issue in the org-docs repository with the `incident` tag. Upon creation, they will tag other team members or otherwise disseminate the public issue URL in community forums, to draw attention and perspectives to the matter. A discussion of the facts and circumstances shall take place in the issue, alongside any documentation of remediation and containment efforts.

If these efforts find that investor information is NOT reasonably likely to have been accessed or used without authorization _within 30 days_,[^hourly] then no notice shall be sent. A determination of this type will be posted in the issue along with reasonable public descriptions as to why it was made. After either a notice or determination on no needed notice, this issue will be closed through the GitHub user interface.

[^hourly]: Really, I'd like to have this as a Unix hourly requirement in the future. - John
