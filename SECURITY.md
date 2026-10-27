# Security and release status

Flush Wallet is a betanet preview. An independent security review is outstanding in [issue #3](https://github.com/seriouscatsoserious/flush-wallet/issues/3). Passing automated checks and maintainer review do not constitute that review.

## Boundaries

The service worker holds the unlocked recovery words and constructs/signs transactions. The content script exposes only the address/request bridge to https://flush.markets in its top frame. Extension storage is restricted to trusted extension contexts. Recovery words and RPC credentials are stored encrypted; addresses and local Activity are public metadata stored on the device.

Explorer/RPC data is checked for output ownership and exact amounts. Token signing and token Activity use resolved metadata, never a marker's predicted trade result. Missing token state prevents token signing; incomplete historical token state is shown as unavailable.

Website approvals expire, bind the reviewed plan and connection, and require an unlocked wallet. Website trade intent hashes are durably consumed before signing/submission, so an interrupted submission requires a fresh site request. The network may accept a transaction even when its response is lost; check Activity before retrying.

RPC is optional. Pairing verifies network identity, keeps credentials encrypted, and requests access only to selected hosts. Re-pairing removes obsolete optional hosts; returning to Explorer removes all optional node-host grants. Direct RPC does not silently contact Explorer for history.

## Reporting

Do not put recovery words, private keys, passwords, node credentials or encrypted vault exports in public issues. Use GitHub's private vulnerability reporting if enabled for this repository; otherwise request a private reporting channel without publishing exploit details or secrets.

## Before broader release

Independent review must cover key/vault handling, message origins, signing and output constraints, website replay/expiry/concurrency, token metadata, dependency provenance and Chrome permission/update behavior. Findings and the exact reviewed commit belong in the security issue. Publisher ownership, public funded flows and the actual store update path remain release gates.
