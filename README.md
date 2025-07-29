# 🎓 CertiChain - Certificate NFT Platform

CertiChain is a blockchain-based certificate verification platform that converts educational certificates into NFTs on the Stacks blockchain. It provides a secure, immutable, and verifiable way to store and manage digital certificates.

## 🌟 Features

### Core Functionality
- **📜 Certificate to NFT Conversion**: Transform JSON certificate data into blockchain-stored NFTs
- **🔗 Blockchain Verification**: Immutable storage on Stacks blockchain with smart contract validation
- **👛 Multi-Wallet Support**: Compatible with Leather and Xverse wallets
- **🎨 Certificate Gallery**: Visual display of all minted certificates
- **🔍 Certificate Verification**: On-chain verification of certificate authenticity

### User Experience
- **🌙 Dark/Light Mode**: Toggle between dark and light themes with persistent storage, now elegantly integrated into the header for a seamless experience
- **📱 Responsive Design**: Fully responsive UI that works on all device sizes
- **💾 Persistent State**: Wallet connections and theme preferences saved locally
- **⚡ Real-time Updates**: Live updates when certificates are minted or verified

### Technical Features
- **🏗️ Smart Contract Integration**: Direct interaction with Clarity smart contracts
- **🌐 Multi-Network Support**: Testnet, Devnet, and Mainnet configurations
- **🔧 Configurable Deployment**: Easy contract address configuration
- **🧪 Comprehensive Testing**: Unit tests for both frontend and smart contracts

## 🏗️ Architecture

### Frontend Stack
- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Stacks.js** libraries for blockchain integration
- **CSS Variables** for flexible theming system
- **Integrated Header Toggle**: Dark mode toggle is part of the header layout for a modern, professional look

### Smart Contracts (Clarity)
- **`certchain.clar`**: Main NFT contract for certificate minting and management
- **`certchain-util.clar`**: Utility functions for certificate operations
- **SIP-009 Compliant**: Follows Stacks NFT standards

### Blockchain Integration
- **Stacks Blockchain**: Layer-1 Bitcoin blockchain for smart contracts
- **Multi-network Support**: Testnet, Devnet, and Mainnet
- **Wallet Integration**: Leather and Xverse wallet support

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Clarinet CLI for smart contract development
- Stacks wallet (Leather or Xverse)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arkrly/CertiChain.git
   cd CertiChain/chain
   ```

2. **Install dependencies**
   ```bash
   # Install contract dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Start development environment**
   ```bash
   # Start frontend development server
   cd frontend
   npm run dev
   
   # In another terminal, check contracts
   clarinet check
   ```

### Smart Contract Development

1. **Check contracts**
   ```bash
   clarinet check
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Deploy to testnet**
   ```bash
   clarinet deploy --testnet
   ```

## ⚙️ Configuration

### Contract Addresses
Update contract addresses in `frontend/src/config/contracts.ts` after deployment:

```typescript
// Update these addresses after deploying your contracts
export const NETWORK_CONFIG = {
  testnet: {
    contracts: {
      certchain: {
        address: 'YOUR_TESTNET_CONTRACT_ADDRESS',
        name: 'certchain'
      }
    }
  }
};
```

### Network Switching
Change the default network in `contracts.ts`:
```typescript
export const DEFAULT_NETWORK = 'testnet'; // or 'devnet', 'mainnet'
```

## 📁 Project Structure

```
chain/
├── contracts/                 # Clarity smart contracts
│   ├── certchain.clar        # Main certificate NFT contract
│   └── certchain-util.clar   # Utility functions
├── tests/                    # Contract unit tests
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── CertificateForm.tsx     # Certificate creation form
│   │   │   ├── CertificateGallery.tsx  # Certificate display
│   │   │   ├── WalletConnection.tsx    # Wallet integration
│   │   │   └── DarkModeToggle.tsx      # Theme switcher
│   │   ├── config/          # Configuration files
│   │   │   └── contracts.ts # Contract addresses & network config
│   │   ├── contexts/        # React contexts
│   │   │   └── ThemeContext.tsx        # Theme management
│   │   ├── utils/           # Utility functions
│   │   │   ├── stacksUtils.ts          # Blockchain integration
│   │   │   └── certificateUtils.ts     # Certificate handling
│   │   └── types/           # TypeScript type definitions
├── settings/                # Network configuration files
└── deployments/            # Deployment plans
```

## 🎯 Usage

### Creating a Certificate NFT

1. **Connect Your Wallet**
   - Click "Connect Wallet" and choose Leather or Xverse
   - Approve the connection request

2. **Fill Certificate Details**
   - Enter recipient name, course details, issuer information
   - Add skills, grades, and expiry dates as needed
   - Upload or provide certificate image URL

3. **Mint Certificate**
   - Review the certificate details
   - Approve the blockchain transaction
   - Certificate NFT will be created and stored on-chain

### Viewing Certificates

- Browse all certificates in the Certificate Gallery
- Click on certificates to view detailed information
- Verify certificate authenticity through blockchain data

## 🧪 Testing

### Smart Contract Tests
```bash
# Run all contract tests
npm test

# Run specific test file
npm test -- certchain.test.ts

# Watch mode for development
npm run test:watch
```

### Frontend Testing
```bash
cd frontend
npm run lint    # Run ESLint
npm run build   # Build for production
```

## 🌐 Deployment

### Smart Contracts

1. **Deploy to Testnet**
   ```bash
   clarinet deploy --testnet
   ```

2. **Update Contract Addresses**
   Copy the deployed contract addresses to `frontend/src/config/contracts.ts`

### Frontend

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy** to your preferred hosting platform (Vercel, Netlify, etc.)

## 🛠️ Development

### Adding New Features

1. **Smart Contract Changes**
   - Modify contracts in `contracts/` directory
   - Add tests in `tests/` directory
   - Run `clarinet check` to validate

2. **Frontend Changes**
   - Add components in `src/components/`
   - Update types in `src/types/`
   - Test locally with `npm run dev`

### Theme Customization

The application uses CSS variables for theming. Customize in component CSS files:
```css
:root {
  --primary-color: #your-color;
  --background-color: #your-bg;
}

[data-theme="dark"] {
  --primary-color: #your-dark-color;
  --background-color: #your-dark-bg;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language](https://docs.stacks.co/clarity/)
- [Stacks Explorer](https://explorer.hiro.so/)
- [Leather Wallet](https://leather.io/)

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Arkrly/CertiChain/issues) page
2. Create a new issue with detailed information
3. Join the Stacks community for support

---

**Built with ❤️ on Stacks Blockchain**

## 🖼️ Screenshots

> _Add screenshots of the CertChain UI here to showcase the integrated header and dark mode toggle._
