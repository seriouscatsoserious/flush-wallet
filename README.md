# Flush Wallet

Chrome wallet for L1 ECX, ECX on Flush, and Flush assets. Recovery words, keys and transaction signing stay in the browser. Explorer is the default connection; no node download or local server is required.

[Download the Chrome extension](https://github.com/seriouscatsoserious/flush-wallet/releases/tag/v0.3.4) · [Installation](https://seriouscatsoserious.github.io/flush-wallet/) · [Remaining work](https://github.com/seriouscatsoserious/flush-wallet/issues)

## Install

1. Download and extract `flush-wallet-0.3.4.zip` from the release.
2. Open `chrome://extensions` in desktop Chrome and enable **Developer mode**.
3. Choose **Load unpacked**, select the extracted `flush-wallet` folder, and pin the extension.
4. Create a wallet or import your recovery words.

You can also load the repository's built `extension/` folder. See [INSTALL.txt](INSTALL.txt) for recovery and connection details.

## Features

- Local 12-word wallet creation, recovery-word confirmation, seed import, encrypted storage and auto-lock.
- Separate L1 and Flush accounts, receive QR codes and a Flush deposit address.
- Native ECX and token transfers, swaps, launch buy/sell approvals and Activity with separate network fees.
- Resolved token receipts and transfers in Explorer Activity; missing historical token data is shown as unavailable.
- Token names and logos from Explorer metadata.
- `flush.markets` connection and transaction approvals, with explicit review before signing.
- Optional own-node RPC under **Settings → Advanced → Connection**, with encrypted credentials and host permissions requested when pairing.

The interface uses the Flush site's official mark, colours, Barlow typography and JetBrains Mono readouts.

## Network and current limits

This release uses **temporary betanet, Flush slot 99**. L1 Explorer address lookups currently return HTTP 405; L1 balances and history can be unavailable until that external service is fixed. Public Explorer-backed Flush buys, sales, native/token sends, return transfers and fresh-profile seed recovery have been verified with confirmed transactions. The site's browser-wallet cancellation/error fix is in [PR #1](https://github.com/block-fabric/flush-markets/pull/1).

Token spending requires resolved per-output metadata; missing metadata blocks token signing. Own-node Activity explicitly shows transactions sent from this browser; incoming receipts still affect balances. Older spent token movements need resolved historical annotations from Explorer. Mainnet, asset creation, liquidity management, auctions, staking and peg-outs are not enabled. The [issues](https://github.com/seriouscatsoserious/flush-wallet/issues) track release blockers and follow-up work.

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
npm test
```

`npm run build` recreates `extension/` from application source and a fixed asset list. The pinned manifest public key preserves the extension ID. No test harnesses, fixtures, screenshots, reports, browser profiles or node software are copied into the extension.

`npm run package` builds a deterministic allowlisted ZIP and SHA-256 file in ignored `output/` (Python 3 is needed for ZIP creation). The ZIP contains only the installable wallet and its licences. The GitHub workflow checks every change and publishes checked betanet ZIPs for matching version tags.

See [packaging and update operations](distribution/OPERATIONS.md), [store listing draft](distribution/STORE.md), [privacy disclosures](https://seriouscatsoserious.github.io/flush-wallet/privacy.html) and [security status](SECURITY.md). Store artwork under `distribution/assets/` uses the actual empty-wallet UI and stays outside the extension package. Publisher/store submission and an independent security review remain outstanding.

Automated checks remain development tools under `test/`. Browser checks require Playwright Chromium (`npx playwright install chromium`). Demo captures and QA reports are written only to ignored `output/`; GitHub Pages serves the installation page from `docs/`.

## Source layout

| Path | Purpose |
| --- | --- |
| `src/core.js` | Key derivation, vault encryption, transaction construction and signing |
| `src/background.js` | Wallet state, approvals and connections |
| `src/api.js` | Explorer reads, metadata, history and broadcasting |
| `src/rpc.js`, `src/connection.js` | Own-node transport and encrypted connection storage |
| `src/popup.*` | Wallet screens |
| `src/manifest.json` | Chrome manifest and pinned extension public key |
| `assets/` | Icons, fonts and licence notices |
| `scripts/build.mjs`, `scripts/package.mjs` | Production build and packaging |
| `test/` | Development checks; excluded from the extension |

Brand reference: [Flush site design rules](https://github.com/block-fabric/flush-markets/blob/main/docs/design.md). Font and dependency licences are in [assets/licenses](assets/licenses).
