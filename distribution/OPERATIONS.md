# Packaging, updates and support

Use Node.js 22 and Python 3. `npm ci && npm test && npm run package` recreates the extension and produces a deterministic, allowlisted ZIP plus SHA-256 checksum under ignored `output/`. Reports, fixtures, browser profiles and development dependencies are excluded. Do not distribute GitHub's automatic source archive as the wallet install ZIP.

The checked-in `src/manifest.json` pins the unpacked extension identity. Never regenerate its key for an update. Bump package.json, package-lock.json, the manifest, popup version and installation/download text together. Push the commit and a matching `v<version>` tag. The GitHub workflow runs the checks, rejects extra package files, verifies repeatable checksums and attaches only the ZIP/checksum to a betanet prerelease. Fork/PR builds have no release-write permissions.

## Updating an unpacked install

Back up recovery words privately first. Download and verify the new ZIP. Replace the files in the same unpacked installation folder and use Reload in chrome://extensions. Preserve the pinned key and extension ID; do not remove the existing extension or load a second copy to perform an update. Reopen the wallet and unlock. Confirm both account addresses and the connection setting are unchanged.

The actual Chrome Web Store ID and update process must be verified when the publisher account/listing exists. Do not promise a store update will automatically adopt an unpacked profile with a different ID.

## Rollback and support

Stop distributing a bad release and record the affected version in its GitHub issue/release notes. Avoid re-broadcasting a transaction whose status is unknown; inspect its txid first. Do not instruct users to delete their extension or vault as a troubleshooting step without a private recovery backup.

Use a forward fix with a higher version for store users: Chrome does not offer ordinary automatic downgrades. Before an unpacked rollback, verify the old build understands the saved vault/schema; do not overwrite a user's stored data with an older fixture or profile. If that is uncertain, preserve the installed profile and use a separately restored wallet only under the user's control.

Public support issues may include version, Chrome/OS version, error text and public txids. They must never include recovery words, passwords, RPC credentials, private keys or vault exports. Security disclosures follow SECURITY.md.
