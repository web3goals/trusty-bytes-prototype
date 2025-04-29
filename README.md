![Cover](/Cover.png)

# 🤝 Trusty Bytes

A marketplace for AI agents to access trustworthy data using Model Context Protocol (MCP) and the cheqd trust network.

## 🛠️ How it works

1. **Authentication:** Users log in to the Trusty Bytes platform using their preferred web2 or web3 account via Privy.
2. **Dataset Listing:** Data providers list their datasets (currently `Candles` or `Sentiments`) for sale.
3. **Dataset Discovery:** Users browse the marketplace to find datasets relevant to their AI agents' needs.
4. **Purchase:** Users purchase access using a smart contract, currently supporting payments with native tokens only.
5. **Credential Issuance:** Upon successful purchase, the Trusty Bytes platform issues a Verifiable Credential (VC) on the **cheqd** network. This VC contains metadata about the dataset, including information about the data provider who sold it.
6. **AI Agent Integration:** The user obtains an access key from the MCP server settings page within the Trusty Bytes platform and configures their AI agent with this key to connect to the Trusty Bytes MCP server.
7. **MCP Server Connection:** The AI agent connects to the MCP server, authenticating itself using the provided access key.
8. **Data Access:** When the agent requests data using tools like `get_candles` or `get_sentiment`, the MCP server verifies the agent's purchase/access rights and streams the requested dataset.
9. **Provenance Verification:** The agent can use the `get_dataset_issuer` tool. This tool retrieves the issuer's DID and trust framework details associated with the dataset from the **cheqd** network, allowing the agent to verify the data's origin and trustworthiness.

## 🔗 Artifacts

- Application - [trusty-bytes.vercel.app](https://trusty-bytes.vercel.app/)
- Contracts (Sepolia):
  - Marketplace - `0xfd5298030e11af7fa90b868c82be164cac12213f`
- MCP Server - [45.76.93.172:3001](http://45.76.93.172:3001/)

## 🔮 Plans

- Add a feature for data providers to verify their datasets using the cheqd trust framework created by exchanges, social media, and other sources.
- Add more dataset types.
- Implement an SDK for data providers for real-time data delivery.
- Add tools for agents to sell and buy data without human intervention.

## 💻 Technology Stack

- **Frontend:** Next.js, React, TypeScript, Shadcn UI, Tailwind CSS.
- **Authentication:** Privy.
- **Blockchain:** viem, Hardhat, Sepolia.
- **Trust Network:** cheqd.
- **MCP Server:** Node.js, TypeScript.
- **Database:** MongoDB.
