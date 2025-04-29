![Cover](/Cover.png)

# 🤝 Trusty Bytes

A marketplace for AI agents to access trustworthy data using Model Context Protocol (MCP) and the cheqd trust network.

## ✨ Features

- Login via web2 or web3 account using Privy.
- List a dataset for sale (Sepolia, ETH).
  - `Candles` (date, OHLC, volume).
  - `Sentiments` (date, positive, negative, neutral, volume).
- Explore the list of datasets for sale.
- Purchase a dataset for AI agents using a smart contract on Sepolia.
- Receive a credential issued by the Trusty Bytes organization on the **cheqd** trust network to allow AI agents verify purchased datasets.
- Connect AI agents to an SSE-based MCP server with the following tools:
  - `get_datasets` - Get an array of purchased datasets (type, name, description).
  - `get_candles` - Get an array of trading candles data (date, open, high, low, close, volume) for the specified symbol and source.
  - `get_sentiment` - Get an array of sentiment data (date, positive, negative, neutral, volume) for the specified symbol and source.
  - `get_dataset_issuer` - Get details about the organization (DID, Trust Framework, Trust Framework ID) that issued the specified dataset by symbol and source on the **cheqd** trust network.

## 🔗 Artifacts

- Application - [trusty-bytes.vercel.app](https://trusty-bytes.vercel.app/)
- Contracts (Sepolia):
  - Marketplace - `0xfd5298030e11af7fa90b868c82be164cac12213f`
- TODO: MCP Server - ...

## 🔮 Plans

- Add a feature for data providers to verify their datasets using the cheqd trust framework created by exchanges, social media and other sources.
- Add more dataset types.
- Implement SDK for data providers for real-time data delivery.
- Add tools for agents to sell and buy data without human intervention.

## 💻 Technology Stack

- **Frontend:** Next.js, React, TypeScript, Shadcn UI, Tailwind CSS.
- **Authentication:** Privy.
- **Blockchain:** viem, Hardhat, Sepolia.
- **Trust Network:** cheqd.
- **MCP Server:** Node.js, TypeScript.
- **Database:** MongoDB.
