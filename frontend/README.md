# 🎨 CertiChain Frontend

The frontend application for CertiChain - a React-based interface for creating and managing certificate NFTs on the Stacks blockchain.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🏗️ Architecture

### Tech Stack
- **React 19** with TypeScript
- **Vite** for build tooling and development
- **CSS Variables** for theming system
- **Stacks.js Libraries** for blockchain integration

### Key Features
- 🌙 **Dark/Light Mode Toggle** with persistent storage
- 👛 **Multi-Wallet Support** (Leather & Xverse)
- 📱 **Responsive Design** for all screen sizes
- ⚡ **Real-time Blockchain Integration**
- 🎨 **Certificate Gallery** with visual display
- 🔒 **Type-safe Development** with TypeScript

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── CertificateForm.tsx      # Certificate creation form
│   ├── CertificateGallery.tsx   # Display certificates
│   ├── WalletConnection.tsx     # Wallet integration
│   └── DarkModeToggle.tsx       # Theme switcher
├── config/              # Configuration
│   └── contracts.ts     # Contract addresses & network config
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Global theme management
├── hooks/               # Custom React hooks
│   └── useTheme.ts      # Theme management hook
├── types/               # TypeScript definitions
│   └── certificate.ts   # Certificate data types
├── utils/               # Utility functions
│   ├── stacksUtils.ts   # Blockchain integration
│   └── certificateUtils.ts # Certificate processing
└── assets/              # Static assets
```

## ⚙️ Configuration

### Environment Setup
The app automatically detects and configures based on the network settings in `src/config/contracts.ts`.

### Contract Configuration
Update contract addresses after deployment:

```typescript
// src/config/contracts.ts
export const NETWORK_CONFIG = {
  testnet: {
    contracts: {
      certchain: {
        address: 'YOUR_CONTRACT_ADDRESS_HERE',
        name: 'certchain'
      }
    }
  }
};
```

### Theme Customization
Customize themes by modifying CSS variables in component files:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}
```

## 🎯 Component Guide

### CertificateForm
Handles certificate creation with form validation and blockchain integration.

**Key Features:**
- Form validation for all certificate fields
- Real-time preview of certificate data
- Integration with wallet for transaction signing
- Error handling and user feedback

### CertificateGallery
Displays all minted certificates in a responsive grid layout.

**Key Features:**
- Responsive grid display
- Certificate detail modals
- Filtering and search capabilities
- Loading states and error handling

### WalletConnection
Manages wallet connections with support for multiple wallet providers.

**Key Features:**
- Leather and Xverse wallet support
- Persistent connection state
- Connection status indicators
- Error handling for connection issues

### DarkModeToggle
Provides theme switching functionality with smooth transitions.

**Key Features:**
- Smooth theme transitions
- Persistent theme preference
- Accessible design with proper ARIA labels
- Icon-based toggle interface

## 🧪 Development

### Adding New Components

1. Create component in `src/components/`
2. Add corresponding CSS file
3. Export from component and add to main App
4. Add TypeScript types if needed

### Styling Guidelines

- Use CSS variables for consistent theming
- Follow BEM naming convention for CSS classes
- Ensure responsive design with flexbox/grid
- Test both light and dark themes

### State Management

- Use React Context for global state (themes, wallet)
- Local component state for form data
- Custom hooks for reusable logic

## 🔧 Build Configuration

### Vite Configuration
The project uses Vite with React SWC plugin for optimal performance:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### TypeScript Configuration
Strict TypeScript settings for type safety:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true
  }
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎨 Design System

### Colors
- Primary: `#667eea` (gradient to `#764ba2`)
- Success: `#10b981`
- Error: `#ef4444`
- Warning: `#f59e0b`

### Typography
- Headings: System font stack
- Body: Clean, readable fonts
- Code: Monospace fonts for technical content

### Spacing
- Base unit: 8px
- Consistent spacing scale (8px, 16px, 24px, 32px, etc.)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new code
3. Test components in both light and dark themes
4. Ensure responsive design works on all screen sizes
5. Add proper error handling and loading states

---

**Part of the CertiChain ecosystem - Building the future of digital certificates on Stacks blockchain** 🎓⛓️

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
