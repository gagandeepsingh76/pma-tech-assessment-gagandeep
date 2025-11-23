# Weather App Backend

Backend API server for the Weather App Assignment 1. Handles geocoding and weather data fetching securely.

## Tech Stack

- **Node.js** with Express.js
- **Axios** for HTTP requests
- **dotenv** for environment variable management
- **CORS** enabled for frontend communication

## Setup & Run Instructions

### 1. Install Dependencies

```bash
cd assignment1/backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your OpenWeatherMap API key:

```
PORT=4000
OWM_KEY=your_actual_openweathermap_api_key_here
GEOCODER_USER_AGENT=WeatherApp/1.0
```

**Getting an OpenWeatherMap API Key:**
1. Sign up at https://openweathermap.org/api
2. Get your free API key from the dashboard
3. Add it to the `.env` file

**Demo Mode:** If the API key is not configured (or set to the placeholder value), the server will automatically enable demo mode. In demo mode, weather requests return mock data instead of real API calls. This allows you to test the app functionality while setting up your API key. The server will display a warning message on startup if demo mode is active.

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:4000`

## API Endpoints

### GET /api/geocode?query=<text>

Geocodes a location query (city, zip, landmark, or coordinates).

**Query Parameters:**
- `query` (required): Location string or coordinates (lat,lon)

**Response:**
```json
[
  {
    "lat": 28.6139,
    "lon": 77.2090,
    "display_name": "New Delhi, Delhi, India"
  }
]
```

**Examples:**
- `/api/geocode?query=New Delhi`
- `/api/geocode?query=94040`
- `/api/geocode?query=40.73061,-73.935242`

### GET /api/weather?lat=<>&lon=<>

Fetches current weather and 5-day forecast for given coordinates.

**Query Parameters:**
- `lat` (required): Latitude (-90 to 90)
- `lon` (required): Longitude (-180 to 180)

**Response:**
```json
{
  "location": "New Delhi, IN",
  "current": {
    "temp_c": 25,
    "feels_like_c": 24,
    "description": "clear sky",
    "icon": "01d",
    "humidity": 45,
    "wind_m_s": 3.5,
    "sunrise": "06:15 AM",
    "sunset": "06:45 PM"
  },
  "forecast": [
    {
      "date": "2024-01-15",
      "min": 18,
      "max": 28,
      "icon": "02d",
      "condition": "Clouds"
    }
  ]
}
```

## Troubleshooting

### CORS Issues
- Ensure CORS middleware is enabled (already configured)
- Check that frontend is making requests to correct backend URL

### Missing API Key Error
- Verify `.env` file exists and contains `OWM_KEY`
- Ensure API key is valid and active on OpenWeatherMap

### Rate Limiting
- OpenWeatherMap free tier has rate limits
- If you hit limits, wait a few minutes before retrying

### Geocoding Service Issues
- Nominatim (OpenStreetMap) is free but may have rate limits
- If geocoding fails, try again after a short delay

## Health Check

Visit `http://localhost:4000/health` to verify the server is running.

