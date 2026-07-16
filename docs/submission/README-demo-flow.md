# Submission Demo Flow

Use this when you need the shortest clean walkthrough for judges.

## Before You Start

1. Run `npm run arc:check`
2. Run `npm run typecheck`
3. Run `npm run build`
4. Start the app with `npm run dev`
5. Start the runner with `npm run agent:runner`
6. Make sure your wallet is on Arc Testnet `5042002`

## Demo Order

1. Open the dashboard homepage.
2. Show `TESTNET` and `SIMULATION` labels in the header.
3. Show the wallet panel with Arc chain ID `5042002`.
4. Show that the dashboard is already updating from the local runner.
5. Open `Contract Panel` and show the ledger address or deploy flow.
6. Open `Auto Bot` and show the planner, next action, and blocker state.
7. Arm the bot and let it prepare a pending intent.
8. Confirm the pending testnet intent with the browser wallet.
9. Show `Recent Trades` and `On-chain Activity`.
10. Open the explorer link for the confirmed transaction.

## What To Emphasize

- The app is Arc Testnet only.
- On-chain actions require explicit browser-wallet confirmation.
- The dashboard is not static: it reads, writes, persists state, and tracks tx lifecycle.
- The app handles Arc-specific USDC behavior, including native 18-decimal gas and ERC-20 6-decimal token logic.

## If Time Is Short

Show only these five moments:

1. Header plus wallet panel on Arc Testnet
2. Contract panel with deploy or configured ledger
3. Auto bot preparing a pending intent
4. Wallet confirmation for one testnet transaction
5. Explorer link and on-chain activity confirmation
