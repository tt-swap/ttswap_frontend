
# TTSWAP

## Summary

TTSWAP (token-token swap) is an automated market-making protocol built on the EVM blockchain,
which means it doesn't rely on centralized institutions or individuals to facilitate trades. The core
principle of TTSWAP is to automatically trigger market value transfers based on user actions, creating
a platform based on a constant value trading model.
The project's whitepaper explains the design logic of TTSWAP, covering the following aspects:
1. ToKen Trading:
Users can directly swap one token for another without the need for intermediary tokens.
2. Value Token Investment and Withdrawal:
Users can invest in specic value tokens and withdraw their investments when needed.
3. Ordinary Token Investment and Withdrawal:
Besides value tokens, users can also invest in ordinary tokens and withdraw their investments at
any time.
4. Generation and Distribution of Transaction Fees:
The transaction fees generated during trades are distributed according to certain rules to
incentivize more participants to join the market.
In summary, TTSWAP provides ordinary users with a simple, transparent, and ecient cryptocurrency
trading platform that uses an innovative AMM logic—the constant value trading model. It aims to
create a convenient, secure, and low-GAS fee platform.

## Local Setup

1. Install package dependencies using `npm install`.
2. Create `.env.local` in your root directory and add your Covalent API key.
```
NEXT_PUBLIC_COVALENT_API_KEY = "<YOUR_API_KEY>"
```
3. To run the application, type the following into your terminal.
```
npm run dev
```
