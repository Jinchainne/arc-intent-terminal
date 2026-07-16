# Video Checklist

Use this right before recording.

## Environment

- `npm run arc:check` passes
- `npm run typecheck` passes
- `npm run build` passes
- `npm run dev` is running
- `npm run agent:runner` is running
- Browser wallet is installed
- Wallet is connected to Arc Testnet `5042002`

## UI Moments To Capture

- Landing dashboard loads without errors
- Header shows `TESTNET` and `SIMULATION`
- Wallet panel shows the connected account and chain ID
- Contract panel shows deploy flow or an active ledger
- Auto bot shows planner and next action
- A pending intent appears
- Browser wallet confirmation popup appears
- Tx hash appears in the app
- Explorer page for the tx opens

## Talking Points

- Arc-native USDC workflow
- Browser-wallet confirmation first
- Testnet only, no mainnet execution
- Strategy engine plus risk gating
- Real app-to-contract workflow, not a static dashboard

## Recording Tips

- Keep browser zoom readable
- Close unrelated tabs and notifications
- Keep wallet popup on screen long enough to recognize Arc Testnet
- Avoid editing `.env` during the recording
- If an RPC call is slow, narrate that the app keeps simulation alive while waiting
