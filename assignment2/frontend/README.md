# Weather Records Frontend

React-based frontend application for the Weather Records Assignment 2. Provides a two-page interface for weather search and record management.

## Tech Stack

- **React 18** with React Router
- **Vite** for build tooling
- **Modern CSS** with responsive design

## Setup & Run Instructions

### 1. Install Dependencies

```bash
cd assignment2/frontend
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

### Home Page (`/`)
- **Location Search**: Enter city names, zip codes, landmarks, or coordinates
- **Geocoding**: Automatically resolves location queries to coordinates
- **Current Weather**: Displays temperature, conditions, humidity, wind, sunrise/sunset
- **5-Day Forecast**: Shows daily min/max temperatures and conditions
- **Use My Location**: Get weather for your current location using browser geolocation
- **Save Record**: Save current weather data as a record

### Records Page (`/records`)
- **View Records**: List all saved weather records
- **Create Record**: Add new records with geocoding support
- **Edit Record**: Update existing records
- **Delete Record**: Remove records with confirmation
- **Export Records**: Export all records as JSON, CSV, or PDF
- **Record Details**: View complete weather snapshots and notes

## Component Structure

- `App.jsx`: Main application component with routing
- `pages/Home.jsx`: Weather search and display page
- `pages/Records.jsx`: Records management page
- `components/LocationInput.jsx`: Input field and action buttons
- `components/CandidateList.jsx`: Displays multiple geocoding results
- `components/WeatherCard.jsx`: Current weather display with save button
- `components/ForecastList.jsx`: 5-day forecast grid
- `components/InfoModal.jsx`: Information modal with PM Accelerator link

## API Integration

The frontend communicates with the backend API at `http://localhost:4000/api`:

- `GET /api/geocode?query=<text>`: Geocoding service
- `GET /api/weather?lat=<>&lon=<>`: Weather data service
- `POST /api/records`: Create record
- `GET /api/records`: Get all records
- `GET /api/records/:id`: Get single record
- `PUT /api/records/:id`: Update record
- `DELETE /api/records/:id`: Delete record
- `GET /api/export/json`: Export as JSON
- `GET /api/export/csv`: Export as CSV
- `GET /api/export/pdf`: Export as PDF

## Routing

The app uses React Router with two main routes:
- `/` - Home page (weather search)
- `/records` - Records page (CRUD operations)

Navigation is handled via the top navigation bar.

## Troubleshooting

### CORS Errors
- Ensure backend is running and CORS is enabled
- Check that backend URL matches your backend server

### Geolocation Not Working
- Ensure you're using HTTPS or localhost (geolocation requires secure context)
- Check browser permissions for location access

### API Connection Errors
- Verify backend server is running on port 4000
- Check browser console for detailed error messages
- Ensure network connectivity

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (recommended: v16 or higher)


