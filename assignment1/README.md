# Assignment 1: Basic Weather App

A complete, production-ready weather application that allows users to search for weather information by any location type (city, zip code, landmark, or coordinates). The app uses live APIs for geocoding and weather data, with a clean and responsive user interface.

**Created by Gagandeep Singh**

## Project Overview

This weather app consists of a React frontend and Node.js/Express backend that work together to provide:

- **Flexible Location Search**: Enter cities, zip codes, landmarks, or coordinates
- **Smart Geocoding**: Automatically resolves location queries using OpenStreetMap Nominatim
- **Current Weather**: Real-time temperature, conditions, humidity, wind speed, sunrise/sunset
- **5-Day Forecast**: Daily aggregated forecast with min/max temperatures
- **Location Services**: "Use my location" feature using browser geolocation
- **Error Handling**: Graceful error messages and loading states

## Tech Stack

### Frontend
- React 18 with Vite
- Modern CSS with responsive design
- Axios for HTTP requests

### Backend
- Node.js with Express.js
- OpenWeatherMap API for weather data
- Nominatim (OpenStreetMap) for geocoding
- CORS enabled for frontend communication

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

### 1. Backend Setup

```bash
cd assignment1/backend
npm install
cp .env.example .env
```

**Important:** Edit `.env` and add your OpenWeatherMap API key:
```
OWM_KEY=your_actual_api_key_here
```

**Demo Mode:** If you don't have an API key yet, the app will automatically use demo mode with mock weather data. You'll see a "DEMO MODE" indicator in the UI. This allows you to test the app functionality while you get your API key.

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:4000`

**Note:** On startup, the backend will warn you if the API key is not configured and enable demo mode automatically.

### 2. Frontend Setup

```bash
cd assignment1/frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Open in Browser

Navigate to `http://localhost:3000` and start searching for weather!

## Getting an API Key

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys in your dashboard
4. Copy your API key and add it to `backend/.env`

**Note:** The free tier has rate limits but is sufficient for development and testing.

## Project Structure

```
assignment1/
├── frontend/              # React frontend application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── package.json
│   └── README.md
│
├── backend/              # Express backend API
│   ├── routes/          # API route handlers
│   │   ├── geocode.js   # Geocoding endpoint
│   │   └── weather.js   # Weather endpoint
│   ├── index.js         # Server entry point
│   ├── package.json
│   ├── .env.example     # Environment variables template
│   └── README.md
│
└── README.md            # This file
```

## Testing the App

### Sample Test Cases

1. **City Name**: 
   - Enter "New Delhi" → Select candidate → View weather

2. **Zip Code**: 
   - Enter "94040" → View weather for that zip code

3. **Coordinates**: 
   - Enter "40.73061,-73.935242" → View weather for those coordinates

4. **Landmark**: 
   - Enter "Eiffel Tower" → Select candidate → View weather

5. **Use My Location**: 
   - Click "Use my location" → Allow permission → View weather

6. **Error Handling**: 
   - Enter "asdfghjkl" (nonsense) → See error message
   - Deny geolocation permission → See fallback message

## Demo Video Script (1-2 minutes)

### What to Show:

1. **Introduction (10s)**
   - Show the app running with header and input field
   - Mention it's a weather app that works with any location type

2. **City Search (20s)**
   - Type "New Delhi" in the input
   - Click "Resolve"
   - If multiple candidates appear, select one
   - Show current weather card with temperature, icon, details
   - Show 5-day forecast below

3. **Zip Code Search (15s)**
   - Clear input
   - Enter "94040"
   - Click "Resolve"
   - Show weather for that location

4. **Coordinates Search (15s)**
   - Enter coordinates "40.73061,-73.935242"
   - Click "Resolve"
   - Show weather for those coordinates

5. **Use My Location (20s)**
   - Click "Use my location" button
   - Allow browser permission
   - Show weather for current location

6. **Info Modal (10s)**
   - Click "Info" button in footer
   - Show modal with PM Accelerator link
   - Close modal

7. **Error Handling (10s)**
   - Enter invalid text like "xyz123"
   - Show error message appears gracefully

**Total: ~2 minutes**

## Features Demonstrated

✅ Multiple location input types (city, zip, coordinates, landmark)  
✅ Geocoding with candidate selection for ambiguous queries  
✅ Current weather with detailed information  
✅ 5-day forecast aggregated by day  
✅ Geolocation integration  
✅ Error handling and loading states  
✅ Responsive UI design  
✅ Info modal with external link  
✅ Footer attribution  

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check that port 4000 is not in use
- Verify `.env` file exists and has valid API key
- Run `npm install` to ensure dependencies are installed

**Frontend can't connect to backend:**
- Ensure backend is running on port 4000
- Check browser console for CORS errors
- Verify API_BASE_URL in `App.jsx` matches backend URL

**Geolocation not working:**
- Geolocation requires HTTPS or localhost
- Check browser permissions
- Some browsers block geolocation on non-secure connections

**API errors:**
- Verify OpenWeatherMap API key is correct
- Check API key hasn't exceeded rate limits
- Ensure internet connection is active

**No weather data shown:**
- Check backend logs for API errors
- Verify coordinates are valid
- Ensure API key has proper permissions

## Development Notes

- Backend runs on port 4000 by default
- Frontend runs on port 3000 by default
- API keys are stored securely in backend `.env` file
- All API calls go through backend to protect API keys
- Forecast data is aggregated from 3-hour intervals to daily min/max

## License

This project is created for educational purposes as part of Assignment 1.

---

**Created by Gagandeep Singh**

