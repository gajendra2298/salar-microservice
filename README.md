# Mathiox Microservices

This project contains multiple microservices for the Mathiox wallet system.

## Microservices

### Wallet System (my wallet/)
- **wallet-microservice** - Core wallet functionality
- **credit-debit-microservice** - Credit and debit operations
- **funds-transfer-microservice** - Funds transfer operations
- **funds-received-microservice** - Funds received tracking
- **funds-transfer-history-microservice** - Transfer history

### Other Services
- **product-team-microservice** - Product team management
- **sponsor-team-microservice** - Sponsor team management
- **user-account-microservice** - User account management

## Quick Start

### Option 1: Using npm (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start all microservices
npm run start
```

### Option 2: Using Windows Batch Script
```bash
# Double-click or run from command line
start-all.bat
```

### Option 3: Using PowerShell Script
```powershell
# Run from PowerShell
.\start-all.ps1
```

### Option 4: From Wallet Directory
```bash
# Navigate to wallet directory
cd "my wallet"

# Install dependencies
npm run install:all

# Start all wallet microservices
npm run start
```

## Individual Service Commands

You can also start individual services:

```bash
# Start specific services
npm run start:wallet
npm run start:credit-debit
npm run start:funds-transfer
npm run start:funds-received
npm run start:funds-history
npm run start:product-team
npm run start:sponsor-team
npm run start:user-account
```

## Build All Services

```bash
# Build all microservices
npm run build:all
```

## Requirements

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for database services)

## Ports

Make sure the following ports are available:
- Wallet services: Various ports (check individual service configs)
- Product Team: Default NestJS port
- Sponsor Team: Default NestJS port  
- User Account: Default NestJS port

## Stopping Services

Press `Ctrl+C` in the terminal to stop all running services.

## Troubleshooting

1. **Port conflicts**: Make sure no other services are using the required ports
2. **Missing dependencies**: Run `npm run install:all` to install all dependencies
3. **Database connection**: Ensure MongoDB is running and accessible
4. **Environment variables**: Check that all required `.env` files are properly configured 