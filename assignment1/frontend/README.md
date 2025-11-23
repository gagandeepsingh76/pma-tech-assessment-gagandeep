# Weather App Frontend

React-based frontend application for the Weather App Assignment 1. Provides an intuitive UI for searching locations and viewing weather data.

## Tech Stack

- **React 18** with Vite
- **Axios** for API calls
- **Modern CSS** with responsive design

## Setup & Run Instructions

### 1. Install Dependencies

```bash
cd assignment1/frontend
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

**Note:** Make sure the backend server is running on `http://localhost:4000` before using the app.

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Features

- **Location Input**: Enter city names, zip codes, landmarks, or coordinates
- **Geocoding**: Automatically resolves location queries to coordinates
- **Current Weather**: Displays temperature, conditions, humidity, wind, sunrise/sunset
- **5-Day Forecast**: Shows daily min/max temperatures and conditions
- **Use My Location**: Get weather for your current location using browser geolocation
- **Candidate Selection**: When multiple locations match, user can choose the correct one
- **Error Handling**: User-friendly error messages for all failure cases
- **Loading States**: Visual feedback during API calls

## Component Structure

- `App.jsx`: Main application component with state management
- `LocationInput.jsx`: Input field and action buttons
- `CandidateList.jsx`: Displays multiple geocoding results for selection
- `WeatherCard.jsx`: Current weather display
- `ForecastList.jsx`: 5-day forecast grid
- `InfoModal.jsx`: Information modal with PM Accelerator link

## API Integration

The frontend communicates with the backend API at `http://localhost:4000/api`:

- `GET /api/geocode?query=<text>`: Geocoding service
- `GET /api/weather?lat=<>&lon=<>`: Weather data service

## Troubleshooting

### CORS Errors
- Ensure backend is running and CORS is enabled
- Check that backend URL in `App.jsx` matches your backend server

### Geolocation Not Working
- Ensure you're using HTTPS or localhost (geolocation requires secure context)
- Check browser permissions for location access
- Some browsers may block geolocation on HTTP (non-localhost)

### API Connection Errors
- Verify backend server is running on port 4000
- Check browser console for detailed error messages
- Ensure network connectivity

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (recommended: v16 or higher)


