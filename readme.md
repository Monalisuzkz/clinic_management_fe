# React + TypeScript App Setup

This guide helps you create a React app with TypeScript using **pnpm**.

## Prerequisites

Before starting, make sure you have:

- **Node.js** installed
- **pnpm** installed globally

Check your versions:
```bash
node -v
pnpm -v
```

Install pnpm globally if needed:
```bash
npm install -g pnpm
```

## Create the App

You can create a React + TypeScript app using Vite:
```bash
pnpm create vite my-app --template react-ts
```

Go to the project folder:
```bash
cd my-app
```

## Install Dependencies
```bash
pnpm install
```

## Start the Development Server
```bash
pnpm dev
```

After running the command, open the local URL shown in your terminal.

## Build for Production
```bash
pnpm build
```

## Preview the Production Build
```bash
pnpm preview
```

## Recommended Project Structure
```
my-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Useful pnpm Commands

Install a package:
```bash
pnpm add package-name
```

Install a dev dependency:
```bash
pnpm add -D package-name
```

Remove a package:
```bash
pnpm remove package-name
```

## Notes

- This setup uses Vite for fast development.
- TypeScript is already configured with the `react-ts` template.
- You can now start building your components inside the `src` folder.