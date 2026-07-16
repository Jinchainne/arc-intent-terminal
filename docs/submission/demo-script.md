# Demo Script

Use this as a lightweight speaking script. Read it naturally, not word for word.

## Opening

"This project is an Arc Testnet quant-style agent dashboard built around USDC-native execution. It combines a live simulation layer, a strategy and risk engine, and an app-to-contract flow that requires explicit browser-wallet confirmation."

## Show The Dashboard

"At the top you can see the app is clearly labeled `TESTNET` and `SIMULATION`. The dashboard is updating live from the runner, so this is not a static UI mock."

## Show Wallet And Arc Context

"Here the wallet panel shows the connected account on Arc Testnet chain ID `5042002`. The app is designed around Arc's USDC-native model, including the distinction between native 18-decimal gas behavior and ERC-20 6-decimal token operations."

## Show Contract Flow

"The contract panel lets me deploy or point the app at an `ArcTradeIntentLedger` on Arc Testnet. The important safety property is that on-chain actions are never auto-sent from the server. They require explicit browser-wallet confirmation."

## Show Auto Bot

"The auto bot continuously scans for qualified opportunities, applies risk checks, and prepares pending testnet intents. It also exposes planner output, next action, and blocker state so the execution process is visible."

## Confirm A Pending Intent

"Now I’m confirming one pending testnet intent in the browser wallet. After confirmation, the app persists the tx hash and updates the on-chain activity feed and recent trade history."

## Show Explorer

"Finally, I can open the explorer link directly from the dashboard and verify the testnet transaction on Arc."

## Closing

"So the submission demonstrates a real Arc workflow: live dashboard state, wallet integration, contract interaction, risk-gated execution, and explorer-verifiable testnet activity."
