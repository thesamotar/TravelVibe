# TravelVibe

A Google Maps Travel Profile prototype web application that provides personalized location recommendations based on user preferences. Built with Next.js, Tailwind CSS, and Google Maps JavaScript API, this interactive app demonstrates AI-driven location filtering and proximity-based notifications.

## Features

- 🗺️ **Interactive Map Interface** - Full-screen Google Maps integration with custom markers
- 📍 **User Location Detection** - Automatic geolocation to center map on your current position
- 🛣️ **Route Planning** - Plan routes between two locations with visual polyline display
- 🧭 **Smart Navigation** - "Start Navigation" button with text input or autocomplete support
- 📊 **Route Information** - Real-time distance and duration display for planned routes
- 🎚️ **Detour Control** - Adjustable max detour slider (0.5-5km) for future recommendations
- 👤 **User Persona Input** - Sidebar form to describe travel preferences and interests
- 🎯 **AI Mock-Filtering** - Smart location filtering based on user persona keywords
- 🚶 **Walking Simulation** - Animated movement feature that simulates walking toward destinations
- 🔔 **Proximity Notifications** - Toast alerts when approaching points of interest
- 🎨 **Modern UI Design** - Clean, Google-inspired interface with glassmorphism effects
- 📱 **Responsive Layout** - Works seamlessly on desktop and mobile devices
- 🌐 **Real-time Updates** - Dynamic marker updates based on persona changes

## How It Works

1. **Enter Your Persona** - Describe your interests in the sidebar (e.g., "I love Indian food and coins")
2. **Update Profile** - Click the button to filter locations based on your preferences
3. **View Filtered Locations** - See relevant markers appear on the map
4. **Simulate Walking** - Click "Simulate Walking" to animate movement toward the first location
5. **Get Notifications** - Receive toast alerts when approaching interesting places

The app uses a local filtering function that matches persona keywords (like "indian", "vegetarian", "coin") with location tags to simulate AI-driven recommendations.

## Technology Stack

- **Framework**: Next.js 16.1.1 (React 19.2.3)
- **Styling**: Tailwind CSS 4.0
- **APIs**: 
  - Google Maps JavaScript API
  - Google Maps Marker Library
- **Icons**: Lucide React
- **Build Tool**: Turbopack (Next.js)
- **Language**: TypeScript 5

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thesamotar/TravelVibe.git
   cd TravelVibe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Google Maps API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
TravelVibe/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with font configuration
│   │   ├── page.tsx         # Main page with state management
│   │   └── globals.css      # Global styles and Tailwind imports
│   ├── components/
│   │   ├── MapComponent.tsx # Google Maps integration
│   │   └── Sidebar.tsx      # User persona input form
│   └── utils/
│       └── mockData.ts      # Location data and filtering logic
├── package.json             # Dependencies and scripts
├── .env.local              # Environment variables (API key)
└── README.md               # This file
```

## API Requirements

This application requires a Google Maps API key with the following APIs enabled:
- Maps JavaScript API
- Marker Library (Advanced Markers)
- Places API (Autocomplete)
- Directions API
- Geocoding API

Get your API key at: https://console.cloud.google.com/

## Version History

### Version 1.1.0 - January 10, 2026 (Commit: e9e8b41)

**Route Planning and Navigation Features**

- 📍 **User Location Detection**
  - Automatic geolocation using browser Geolocation API
  - Map centers on user's actual location
  - Fallback to San Francisco if geolocation fails or denied
  - Loading state during position detection

- 🗺️ **Route Planning System**
  - Start and end location inputs with Google Places Autocomplete
  - "Start Navigation" button (renamed from "Plan Route")
  - Route info display showing distance and duration
  - Max detour slider (0.5-5km range) for future recommendations

- 🛣️ **Google Directions API Integration**
  - Route calculation between two points
  - Blue polyline visualization on map
  - Green circular marker for start location
  - Red circular marker for end location
  - Automatic map bounds adjustment to fit entire route

- ⌨️ **Text Input Fallback**
  - Geocoding API integration for text-only addresses
  - Navigation button enables with typed text (no autocomplete required)
  - Smart enable logic: works with autocomplete OR plain text
  - Error handling for invalid addresses

- 🎨 **UI Enhancements**
  - Route planning section in sidebar
  - Route info box with green styling
  - Detour distance slider with real-time value display
  - Improved button states and interactions

### Version 1.0.0 - January 10, 2026 (Commit: 7fe18e7)

**Initial release with core functionality**

- 🗺️ **Google Maps Integration**
  - Full-screen interactive map centered on San Francisco
  - Custom blue circular marker for user position
  - Red markers for points of interest
  - Smooth map panning and zoom controls

- 👤 **User Persona System**
  - Sidebar with textarea for persona input
  - "Update Profile" button to trigger filtering
  - Example suggestions for quick testing
  - Clean, modern form design

- 🎯 **Smart Location Filtering**
  - Mock AI filtering based on keyword matching
  - Support for keywords: indian, vegetarian, veg, coin, numismatic
  - Dynamic marker updates when profile changes
  - Hardcoded location database with 6 sample locations

- 🚶 **Walking Simulation**
  - "Simulate Walking" button in bottom-right corner
  - Animated movement toward first filtered location
  - Smooth interpolation (5% per frame)
  - Automatic map panning to follow user marker
  - "Stop Walking" functionality

- 🔔 **Proximity Notifications**
  - Beautiful toast notification with glassmorphism effect
  - Triggers when within ~200m of target location
  - Shows location name in notification
  - Dismissible with close button
  - Smooth slide-in animation

- 🎨 **UI/UX Design**
  - Google-inspired clean interface
  - Tailwind CSS 4.0 with custom theme
  - Outfit font from Google Fonts
  - Blue accent color (#4285F4)
  - Responsive sidebar layout
  - Shadow and border styling

- 🔧 **Technical Implementation**
  - Migrated to `@googlemaps/js-api-loader` v2.x functional API
  - Uses `setOptions()` and `importLibrary()` instead of deprecated `Loader` class
  - Fixed hydration mismatch with `suppressHydrationWarning`
  - TypeScript for type safety
  - React hooks for state management

## License

MIT License - feel free to use this project for learning and development purposes.

## Author

Created by [thesamotar](https://github.com/thesamotar)

## Acknowledgments

- Google Maps Platform for the mapping APIs
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling approach
