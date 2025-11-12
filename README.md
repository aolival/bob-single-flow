# BoB - Single Flow Bundle Builder

A standalone UI for single loan document bundling, built as part of the Bundle Builder Initiative ('BoB').

## Overview

The Single Flow Bundle Builder resolves productivity bottlenecks in Byte by providing a dedicated UI for document bundling without locking users out of the LOS system. This tool allows Shippers, Trade Group, and Post-Closing Review Group to generate bundles efficiently while maintaining access to other critical tasks.

## Features

- **Subject Loan Selection**: Search and select individual loans for bundling
- **Bundle Name Configuration**: Choose from 80+ investor-specific bundle configurations
- **Stacking Order Display**: View document requirements organized by category and display order
- **Real-time Status Tracking**: Filter documents by All, Missing, or Found status
- **Bundle Generation**: Execute bundle build with progress indication
- **PDF Output**: Download generated bundle PDFs
- **Error Handling**: Robust error recovery with retry functionality

## Technology Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd bob-single-flow
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## User Stories Implemented

This application implements the following approved BRDs:

- **User Story 76334**: Standalone Bundle Builder Platform Launch Point
- **User Story 76335**: Single Flow Path - Landing Page Features / Bundle Name Dropdown Selection
- **User Story 77115**: Single Flow Path - Landing Page / PDF Output Product Process

## Workflow

1. **Select Subject Loan**: Enter or search for the loan number
2. **Choose Bundle**: Select the target investor or bundle type from dropdown
3. **Load Stacking Order**: View the required documents for the selected bundle
4. **Review Documents**: Check All/Missing/Found documents
5. **Build Bundle**: Execute bundle generation process
6. **Download**: Retrieve the generated PDF bundle

## Bundle Types Supported

### Quality Control Bundles
- C2C - QC Bundle
- Docs Back - QC Bundle
- Funded - QC Bundle

### Investor Bundles
- Bank of America, Wells Fargo, Chase, JP Morgan Chase
- Ally, AmeriHome, Caliber, Freedom Mortgage
- 70+ additional investor-specific configurations

### Audit Bundles
- FNMA Audit
- Agency Due Diligence

## Database Integration

The application integrates with BytePro database tables:

- `dbo.Bundle` - Bundle configurations and metadata
- `dbo.DocumentStack` - Stacking order definitions
- `dbo.EmbeddedDoc` - Loan document data
- `dbo.FileData` - File metadata

## Permissions

Users must have one of the following permissions to access this tool:
- **Shipper** role
- **Limited Admin** role

## Project Structure

```
bob-single-flow/
├── src/
│   ├── components/
│   │   └── BoBSingleFlow.jsx    # Main Single Flow component
│   ├── App.jsx                   # App wrapper
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind styles
├── public/                       # Static assets
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── postcss.config.js            # PostCSS configuration
```

## License

Proprietary - All rights reserved
