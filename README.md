# VIN Decoder

A modern, responsive web application for decoding Vehicle Identification Numbers (VINs) using the NHTSA vPIC API. Built with React, TypeScript, and Tailwind CSS.

## Features

- **VIN Validation**: Real-time validation of 17-character VINs
- **Optional Year Input**: Improve accuracy by providing the model year
- **Comprehensive Results**: Display detailed vehicle specifications, manufacturing info, and summary
- **Dark/Light Theme**: Toggle between themes with system preference support
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Graceful handling of invalid VINs and API failures
- **Loading States**: Visual feedback during API requests

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **API**: NHTSA vPIC API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vins
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Usage

1. Enter a valid 17-character VIN in the input field
2. Optionally provide the model year for improved accuracy
3. Click "Decode VIN" to fetch vehicle information
4. View comprehensive results including:
   - Basic vehicle information (make, model, year, etc.)
   - Technical specifications (engine, transmission, fuel type)
   - Manufacturing details (plant location, manufacturer)
   - Vehicle summary with key highlights

## API Integration

This application uses the [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/) to decode VIN numbers:

- **Endpoint**: `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/{VIN}?format=json&modelyear={YEAR}`
- **Method**: GET
- **Response Format**: JSON
- **Rate Limiting**: No authentication required, but please use responsibly

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── theme-provider.tsx  # Theme context provider
│   ├── theme-toggle.tsx    # Theme switcher component
│   ├── vin-form.tsx        # VIN input form
│   └── vehicle-results.tsx # Results display component
├── lib/
│   ├── nhtsa-api.ts        # API service and data processing
│   └── utils.ts            # Utility functions
├── App.tsx                 # Main application component
├── main.tsx                # React app entry point
└── index.css               # Global styles and CSS variables
```

## Features in Detail

### VIN Validation
- Enforces 17-character requirement
- Excludes invalid characters (I, O, Q)
- Real-time validation with error messages

### Theme System
- Light and dark mode support
- Persistent theme preference
- CSS custom properties for smooth transitions

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Optimized for all screen sizes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Vehicle data provided by [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/)
- UI components by [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)