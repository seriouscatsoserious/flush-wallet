# Explorer integration requirements

Default Explorer hosts are explorer.blockfab.org/betanet for L1 and /betanet/flush for Flush. No new service is required on a wallet user's machine.

## L1 indexing

The wallet needs the Esplora address summary, `/api/address/:address/utxo`, `/api/address/:address/txs`, parent `/api/tx/:txid`, tip height and POST transaction broadcast. The deployed L1 address route returned HTTP 405 on 2026-10-27 with "Address lookups cannot be used with bitcoind as backend." The Explorer's ecash-explorer source branch already has an address index, but the deployed service must enable/build it or use an indexed backend. A wallet build cannot change that remote configuration.

Unindexed/not-ready data must be an error, not a successful empty balance. Return complete scripts, exact safe-integer native satoshi values, confirmation status and prevouts. The wallet verifies selected UTXOs against their parent transactions.

## Token balances and signing

Every resolved Flush UTXO needs `token: null` for ordinary ECX, or `{kind, id, amount_units}` for a token. `amount_units` must be a canonical positive decimal **string**, bounded to signed 64-bit units. Non-spendable/unresolved pending results must have `spendable: false`. The wallet never treats a transaction marker as the final result of a swap.

## Historical token movements

For accurate history after recovery and after outputs are spent, the same resolved token annotation must survive in BOTH:

- each transaction `vout[n].token`;
- each input `vin[n].prevout.token`, with that previous output's script/value.

Use explicit `token: null` for ordinary ECX. Keep native fee as a separate exact satoshi field. An annotation must reflect actual post-execution state, including a launch or routed swap's result, rather than `decodeassettx`'s predicted marker output. Preserve it when the outpoint is spent and undo/update it on reorgs.

The wallet now consumes this contract and resolves asset ticker/decimals by ID. It can also verify current unspent receipts via the existing resolved UTXO endpoint. If owned historical inputs or outputs have no resolved metadata, it shows that limitation and does not invent token quantities. Current gettxout-only annotations cannot reconstruct already-spent outputs; this remains the backend portion of wallet issue #6.

Read-only own-node mode does not silently fall back to Explorer for missing history.
