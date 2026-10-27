# Chrome Web Store listing draft

Name: Flush Wallet

Short description: A Chrome wallet for eCash and Flush. Receive, send and swap with keys kept on your device.

## Description

Your wallet. On Flush.

Keep L1 ECX, ECX on Flush and Flush assets together. Create a wallet or import your recovery words, receive funds, send tokens, review swaps and approve transactions from flush.markets.

Recovery words are generated locally, stored encrypted, and never sent to the site or Explorer. Each transaction requires your review and is signed in the extension. The public Explorer is the default connection: no node download or local server is required. An optional own-node connection is tucked away in Advanced settings.

This release supports temporary betanet, Flush slot 99. Mainnet is not enabled. Current release blockers are tracked in the linked repository issues.

## Listing links

- Installation: https://seriouscatsoserious.github.io/flush-wallet/
- Privacy: https://seriouscatsoserious.github.io/flush-wallet/privacy.html
- Support: https://github.com/seriouscatsoserious/flush-wallet/issues
- Source: https://github.com/seriouscatsoserious/flush-wallet

## Permission and data disclosures

- `storage`: local encrypted recovery-word vault, public account information, connection choice and Activity. Chrome storage sync is not used.
- Explorer and flush.markets hosts: account/transaction reads, asset metadata, quotes, broadcasting locally signed transactions and site wallet approvals.
- Optional HTTP/HTTPS node hosts: only granted when the user explicitly pairs their own node. Remote RPC requires HTTPS; loopback HTTP is supported. Credentials are encrypted locally and sent only to the paired nodes. Returning to Explorer revokes optional node permissions.
- No analytics, advertising, seed upload, remote signing or sale of data is implemented. Explorer/site/node operators receive the addresses and requests needed to provide their service; broadcasts and confirmed transactions are public.

## Publisher work still required

- Choose and verify the Chrome Web Store publisher account and support identity.
- Review the listing and actual privacy/data disclosures in the store console.
- Set the intended betanet visibility/release channel.
- Resolve release blockers before a production/mainnet listing.
- Submit the checked ZIP and official assets, and complete Chrome's review process.

The GitHub extension ID is pinned for unpacked installs. The store controls the identity of its listing: verify the final store ID and wallet-preserving update path before switching users to it.
