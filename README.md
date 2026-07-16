# arc-intent-terminal

`arc-intent-terminal` is a builder-first Arc Testnet app for the **Programmable Money Hackathon**.

It is a realtime terminal-style interface for preparing, reviewing, and confirming Arc testnet trade intents with explicit browser-wallet approval. The project is designed to demonstrate a full Arc builder workflow: live UI, strategy simulation, risk gating, state persistence, wallet integration, contract interaction, and explorer-verifiable testnet activity.

This project is:

- built for Arc Testnet
- built for hackathon demos and builder submissions
- browser-wallet confirmation first
- simulation-first for strategy and PnL

This project is not:

- a mainnet trading bot
- a real-money execution system
- a profit claim
- a server-side auto-signing workflow

## Why This Fits Programmable Money Hackathon

`arc-intent-terminal` is built around the core idea of programmable money on Arc:

- USDC-native execution context
- agent-assisted intent preparation
- explicit human confirmation for on-chain actions
- visible state transitions from signal to intent to transaction
- Arc-specific handling of native 18-decimal gas and ERC-20 6-decimal token amounts

For judges, the value is simple:

- the app is not a static dashboard
- the app is not fake contract integration
- the app shows real app-to-contract workflow on Arc Testnet
- the app makes Arc-specific constraints legible to users

## What The Project Does

`arc-intent-terminal` combines four layers:

1. `Simulation Layer`
Generates market movement, trade opportunities, feed updates, Monte Carlo snapshots, and simulated PnL.

2. `Risk Layer`
Applies confidence, chain, RPC, and loss-based checks before any intent can move forward.

3. `Intent Layer`
Prepares local testnet intents and keeps their lifecycle visible in the dashboard.

4. `Contract Layer`
Uses a browser wallet to deploy or interact with `ArcTradeIntentLedger` on Arc Testnet after explicit user confirmation.

## Hackathon Demo Story

The cleanest demo story for this project is:

1. show the live dashboard updating in realtime
2. show Arc Testnet wallet context
3. show the contract panel and ledger setup
4. show the auto bot preparing a pending intent
5. confirm one transaction in the browser wallet
6. show the tx hash in the app
7. open the explorer link on ArcScan

That gives a compact but credible builder narrative:

- strategy logic exists
- risk gating exists
- state persists
- contract flow is real
- confirmation is explicit
- the result is visible on-chain

## Core Features

- Realtime terminal-style Arc dashboard
- Arc Testnet wallet connect and network switch flow
- Contract deploy flow for `ArcTradeIntentLedger`
- Manual browser-wallet confirmation for testnet intents
- Auto bot planner with next action and blocker state
- Simulated signal generation across multiple markets
- Risk scoring and rejection logic
- Recent trades, live feed, and chain activity panels
- Local persistence for demo continuity
- Runner loop for ongoing cycles

## Arc Testnet Reference

- Network: `Arc Testnet`
- Chain ID: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: `https://testnet.arcscan.app`
- ERC-20 USDC: `0x3600000000000000000000000000000000000000`

## Arc Decimal Rules

This repo follows Arc's important USDC rules:

- native USDC gas and `msg.value` use `18 decimals`
- ERC-20 USDC balance and token operations use `6 decimals`

Examples:

- native `1 USDC` => `1e18`
- ERC-20 `1 USDC` => `1e6`

Never mix the two.

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS
- Recharts
- viem
- Ollama or Groq for agent responses
- GitHub Actions for hosted runner scheduling
- Vercel for hosted UI/API

## Safety Model

- testnet only
- no mainnet execution path
- no server-side private key flow
- browser-wallet confirmation is required for on-chain writes
- simulation PnL is clearly not real performance
- secrets are redacted before model calls

## Quick Start

Install dependencies:

```bash
npm install
```

Create local env file:

```bash
cp .env.example .env.local
```

Start the app:

```bash
npm run dev
```

Start the local runner in another terminal:

```bash
npm run agent:runner
```

Open:

```text
http://localhost:3000
```

## Environment

Core model envs:

```env
AI_API_KEY=
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile

GROQ_API_KEY=
GROQ_MODEL=qwen/qwen3-coder

OLLAMA_BASE_URL=http://localhost:11434
LOCAL_CHAT_MODEL=qwen2.5-coder:7b
LOCAL_EMBED_MODEL=nomic-embed-text
AGENT_PROVIDER=auto
```

Arc envs:

```env
NEXT_PUBLIC_ARC_CHAIN_ID=5042002
NEXT_PUBLIC_ARC_RPC_URL=https://rpc.testnet.arc.network
NEXT_PUBLIC_ARC_EXPLORER_URL=https://testnet.arcscan.app
NEXT_PUBLIC_ARC_USDC_ADDRESS=0x3600000000000000000000000000000000000000
```

Execution envs:

```env
PAPER_TRADING_ONLY=false
REAL_TRADING_DISABLED=true
NEXT_PUBLIC_ENABLE_TESTNET_CONTRACT_MODE=true
NEXT_PUBLIC_TRADE_INTENT_LEDGER_ADDRESS=0x...
RUNNER_SECRET=...
CRON_SECRET=...
AGENT_RUNNER_INTERVAL_MS=12000
```

Notes:

- restart the dev server after env changes
- on-chain submission requires a connected browser wallet
- do not use mainnet keys
- do not add server-side signing back into this project

## Verification

Before calling the project hackathon-ready, run:

```bash
npm run arc:check
npm run typecheck
npm run build
```

## Local Demo Flow

1. Start Ollama if you want local model responses.
2. Run `npm run dev`.
3. Run `npm run agent:runner`.
4. Open the dashboard.
5. Let several cycles populate the feed and charts.
6. Connect your wallet.
7. Switch to Arc Testnet `5042002`.
8. Deploy or load `ArcTradeIntentLedger`.
9. Arm the bot in Browser Wallet Mode.
10. Confirm one pending intent in your wallet.
11. Show `Recent Trades`, `On-chain Activity`, and the ArcScan link.

## Submission Kit

- Demo flow: `docs/submission/README-demo-flow.md`
- Video checklist: `docs/submission/video-checklist.md`
- Demo script: `docs/submission/demo-script.md`

## Main UI Panels

- `Terminal Header`: session, wallet, chain, RPC, model
- `Wallet Panel`: wallet status and Arc chain context
- `Contract Panel`: deploy and configure ledger
- `Auto Bot`: planner, next action, blocker, cycle state
- `Trade Controls`: manual mode and intent flow
- `Recent Trades`: local and chain-aware trade log
- `On-chain Activity`: intent and tx lifecycle
- `Market Chart`: current selected market
- `Execution Cycle`: active phase
- `Agent Console`: ask questions about configuration, risk, and Arc behavior

## Runner Model

There are two runner paths:

### 1. Local runner

- command: `npm run agent:runner`
- best for local demos
- keeps state advancing continuously

### 2. Hosted scheduler

- GitHub Actions can call `/api/runner`
- useful for keeping the hosted app active
- still uses the same browser-wallet confirmation model for real testnet writes

## Contract Flow

The project contract is:

```text
contracts/ArcTradeIntentLedger.sol
```

The dashboard supports:

- browser-wallet deploy flow
- deployment status polling
- local ledger persistence
- browser-wallet confirmation for testnet contract intents

## Troubleshooting

### No tx hash appears

Check:

1. are you still in `paper` mode
2. is `NEXT_PUBLIC_ENABLE_TESTNET_CONTRACT_MODE=true`
3. is the ledger address configured
4. did the wallet confirmation popup appear
5. is the wallet connected to Arc Testnet `5042002`

### Dashboard moves but the bot is not really advancing

The UI has lightweight animation even without a real runner loop.

To advance real cycles:

- run `npm run agent:runner` locally
- or verify your hosted runner trigger

### Hosted app says Ollama is unavailable

That is expected if the app is deployed remotely.

Use:

- Ollama for local development
- Groq or another reachable provider for hosted inference

### Pending intents never complete

Check:

- wallet connection
- correct Arc chain
- configured ledger address
- browser-wallet confirmation
- RPC health

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run agent:once
npm run agent:runner
npm run arc:check
npm run arc:refresh-docs
npm run arc:seed
npm run arc:embed-docs
npm run arc:build-ledger
```

## For Judges

If you are reviewing this project for **Programmable Money Hackathon**, the intended takeaways are:

- this is an Arc-native builder workflow, not a generic dashboard
- on-chain behavior is visible and verifiable
- the app respects explicit user confirmation
- the project demonstrates how agents can prepare programmable-money intents safely on Arc

## License / Usage

This repository is intended for hackathon, builder, and testnet experimentation use.
