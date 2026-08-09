# TTSwap Interface

Open-source frontend for **TTSwap** — a Constant Value AMM (CV-AMM) on EVM chains.

This repository is the web UI that talks to [`ttswap-core`](https://github.com/ttswap/ttswap-core) contracts and [subgraph](https://github.com/ttswap/ttswap-subgraph). It covers swap, single-sided liquidity, portfolio / commission views, public sale, and token management.

**Live site:** [https://ttswap.io](https://ttswap.io)  


---

## Why TTSwap (short)

TTSwap is not a classic Uniswap-style pair DEX. The market is a **Singleton**: every asset (“good”) lives in one pool under `TTSwap_Market`, addressed by `T_GoodKey`. Cross-token swaps go through a shared value layer in one call (`buyGoodInput → buyGoodOutput`).

Highlights for integrators:

| Idea | What it means in the UI / contracts |
|------|-------------------------------------|
| Constant Value AMM | Algebraic pricing (fixed K = 2), no Newton iteration |
| One good, one pool | List / trade any ERC-20 (and native ETH) without opening N² pairs |
| Single-sided LP | `initGood` / `investGood` / `disinvestProof` — no forced 50/50 |
| Six-way fee split | LP / Operator / Gate / Referral / Customer / Platform |
| PayFi path | `payGood` exact-out + same-token fast path; EIP-712 meta-tx on swap/pay |
| TTS economics | Stake-on-invest (when promised), public sale, price-driven unlock |

Full math, `safeLine`, and governance details are in the technical whitepaper.

---

## Features (this app)

- **Home** — market overview, hero stats, trading aggregates (GraphQL)
- **Trade** — token swap (`buyGood`), native ETH support, slippage / settings
- **Tokens** — browse goods, token detail, create / update / freeze flows
- **Invest / withdraw** — single-sided liquidity via `investGood` / `disinvestProof`
- **Profile** — portfolio, investment proofs, commissions, referrals
- **Public sale** — TTS public-sale participation and history
- **Wallet** — RainbowKit + wagmi / ethers v6, Permit2 approvals
- **i18n** — English / Chinese (`react-i18next`)

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 18, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4, Radix UI, Ant Design (legacy pieces) |
| Wallet | wagmi, viem, RainbowKit, ethers v6 |
| State | Zustand, TanStack Query |
| Data | Apollo Client + GraphQL (The Graph) |
| Routing | react-router-dom (lazy-loaded pages) |
| Path alias | `@/` → `src/` |

---

## Project layout

```
src/
├── pages/           # Home, Trade, Tokens, Profile, PublicSale, …
├── components/      # trade, tables, dialogs, home, ui (shadcn-style)
├── hooks/           # useWallet, useSwap, useInvest, …
├── stores/          # swap, invest, valueGood, …
├── services/graphql # Apollo queries (swap / invest / goods / account / overview)
├── data/            # chainIds, contractConfig, ABIs (Market, TTS, Permit2, ERC20)
├── config/          # wagmi, site, portal address
├── routes/          # route table
└── i18n/            # en.json / zh.json
```

Contract calls (approve → `buyGood` / `investGood` / `initGood` / `disinvestProof`, etc.) live mainly in `src/hooks/useWallet.ts`. Per-chain market, Permit2, WETH, TTS, USDT, and subgraph URLs are in `src/data/contractConfig.ts`.

---

## Quick start

### Requirements

- Node.js 18+ (20 recommended)
- npm (lockfile is `package-lock.json`)
- A browser wallet (MetaMask, Rabby, …)

### Install & run

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Other scripts

```bash
npm run build        # production build → build/
npm run build:prod   # build + compress
npm run preview      # serve the production build
npm run lint         # ESLint
```

---

## Configuration

### Chains & contracts

Edit `src/data/contractConfig.ts` for each `chainId`:

- `contractAddress` — `TTSwap_Market` (proxy) address  
- `theGraphApi` — subgraph HTTP endpoint  
- `permit2Address` — Permit2  
- `weth9` / `tts` / `usdt` — helpers for UI and approvals  

Supported examples in-repo include Ethereum mainnet (`1`) and Sepolia (`11155111`), plus stubs for other L2s — verify addresses before using on production.

### Portal / referral

Gate / portal address used in fee routing: `src/config/PortalAddress.ts`.

### Environment

Optional local env file (Vite / tooling):

```bash
# .env.local — do not commit secrets
# Add keys only if you enable optional third-party APIs
```

Wallet RPC and app identity are wired through `src/config/wagmi.ts` (and related wagmi helpers). Point them at your own WalletConnect project id / RPC URLs for a public deployment.

---

## How the UI maps to the protocol

| UI action | Typical contract entry |
|-----------|-------------------------|
| Swap A → B | `buyGood` |
| Exact-out / merchant pay | `payGood` (when exposed in UI) |
| List a new token | `initGood` |
| Add liquidity (one token) | `investGood` |
| Remove liquidity | `disinvestProof` |
| Collect fees / commissions | account GraphQL + on-chain claim helpers |

Indexer reads (history, TVL, token lists) go through `src/services/graphql/*`.

---

## Related repositories

| Repo | Role |
|------|------|
| [ttswap-core](https://github.com/ttswap/ttswap-core) | Solidity market + TTS token |
| [ttswap-subgraph](https://github.com/ttswap/ttswap-subgraph) | subgraph |
| [ttswap-doc](https://github.com/ttswap/ttswap-doc) | ttswap knowledge base |

---

## Contributing

1. Fork and create a feature branch  
2. Keep changes focused (UI, hooks, or GraphQL — avoid drive-by refactors)  
3. Run `npm run lint` and smoke-test swap / invest on a testnet  
4. Open a PR with a short description of the user-facing change  

Issues and PRs that improve docs, Sepolia DX, or subgraph sync reliability are especially welcome.

---

## Links

- Website: [https://ttswap.io](https://ttswap.io)  
- X: [@ttswapfinance](https://x.com/ttswapfinance)  
- Telegram: [t.me/ttswapfinance](https://t.me/ttswapfinance)  
- Discord: [discord.gg/XygqnmQgX3](https://discord.gg/XygqnmQgX3)  
- Email: [bussiness@ttswap.io](mailto:bussiness@ttswap.io)

---

## License

Check the repository `LICENSE` file (if present) and the core contracts license for on-chain code.
