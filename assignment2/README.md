# Assignment 2: Weather Records App

A complete weather records management application with database persistence, CRUD operations, and export functionality. Built on top of Assignment 1's weather search capabilities.

**Created by Gagandeep Singh**

## Project Overview

This application extends Assignment 1 with:

- **Database Storage**: SQLite database with Sequelize ORM for persistent storage
- **CRUD Operations**: Full Create, Read, Update, Delete for weather records
- **Weather Snapshots**: Save complete weather data with location and date
- **Export Functionality**: Export records as JSON, CSV, or PDF
- **Two-Page Frontend**: Home page for weather search, Records page for management
- **Optional Integrations**: YouTube and Google Maps API support

## Tech Stack

### Backend
- Node.js with Express.js
- Sequelize ORM with SQLite
- OpenWeatherMap API for weather data
- Nominatim (OpenStreetMap) for geocoding
- PDFKit for PDF generation
- CSV export functionality

### Frontend
- React 18 with React Router
- Vite for build tooling
- Modern CSS with responsive design

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

### 1. Backend Setup

```bash
cd assignment2/backend
npm install
cp .env.example .env
```

Edit `.env` and add your OpenWeatherMap API key:
```
OWM_KEY=your_actual_api_key_here
```

**Important:** If you have an existing database file (`database.sqlite`), delete it to use the new schema:
```bash
# On Windows
del database.sqlite

# On Mac/Linux
rm database.sqlite
```

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:4000`

**Note:** The database will be automatically created on first run with the correct schema.

### 2. Frontend Setup

```bash
cd assignment2/frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Open in Browser

Navigate to `http://localhost:3000` and start using the app!

## Features

### Home Page
- Search weather by location (city, zip, coordinates, landmark)
- View current weather and 5-day forecast
- Save weather records directly from search results
- Use device geolocation

### Records Page
- View all saved weather records
- Create new records with geocoding support
- Edit existing records
- Delete records
- Export records as JSON, CSV, or PDF
- Filter and search capabilities

### Database Schema

**Records Table:**
- `id` (Primary Key, Auto-increment)
- `name` (String, required) - User-defined name for the record
- `location_input` (String, required) - Original location input/search term
- `lat` (Decimal, required) - Latitude coordinate
- `lon` (Decimal, required) - Longitude coordinate
- `display_name` (String, required) - Formatted location name
- `start_date` (Date, required) - Start date of the record
- `end_date` (Date, optional) - End date of the record (for date ranges)
- `saved_at` (Timestamp) - When the record was saved
- `weather_snapshot` (JSON text) - Complete weather data snapshot

## API Endpoints

### Weather & Geocoding (from Assignment 1)
- `GET /api/geocode?query=<text>` - Geocode locations
- `GET /api/weather?lat=<>&lon=<>` - Get weather data

### Records CRUD
- `POST /api/records` - Create a new record
- `GET /api/records` - Get all records (with optional filters)
- `GET /api/records/:id` - Get a single record
- `PUT /api/records/:id` - Update a record
- `DELETE /api/records/:id` - Delete a record

### Export
- `GET /api/export/json` - Export all records as JSON
- `GET /api/export/csv` - Export all records as CSV
- `GET /api/export/pdf` - Export all records as PDF

### Optional Integrations
- `GET /api/integrations/youtube?query=<location>` - Search YouTube videos
- `GET /api/integrations/maps?lat=<>&lon=<>` - Get Google Maps embed URL

## Project Structure

```
assignment2/
├── backend/
│   ├── models/
│   │   ├── index.js          # Sequelize setup
│   │   └── Record.js          # Record model
│   ├── routes/
│   │   ├── geocode.js        # Geocoding endpoint
│   │   ├── weather.js         # Weather endpoint
│   │   ├── records.js         # CRUD endpoints
│   │   ├── export.js          # Export endpoints
│   │   └── integrations.js    # Optional API integrations
│   ├── index.js               # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Weather search page
│   │   │   └── Records.jsx    # Records management page
│   │   ├── components/
│   │   │   ├── LocationInput.jsx
│   │   │   ├── CandidateList.jsx
│   │   │   ├── WeatherCard.jsx
│   │   │   ├── ForecastList.jsx
│   │   │   └── InfoModal.jsx
│   │   ├── App.jsx            # Main app with routing
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── README.md
│
└── README.md                   # This file
```

## Usage Examples

### Creating a Record

1. Go to Home page
2. Search for a location
3. Click "Save This Record" button
4. Record is saved with current weather snapshot

### Manual Record Creation

1. Go to Records page
2. Click "+ New Record"
3. Search for location or enter coordinates manually
4. Select date and add optional notes
5. Click "Create Record"

### Exporting Records

1. Go to Records page
2. Click "Export JSON", "Export CSV", or "Export PDF"
3. File downloads automatically

## Demo Mode

If OpenWeatherMap API key is not configured, the app runs in demo mode:
- Weather data is generated as mock data
- All features work normally
- Records can still be saved and managed
- Perfect for testing without API keys

## Troubleshooting

### Database Issues
- Database file is created automatically at `backend/database.sqlite`
- If issues occur, delete the database file and restart the server
- Check that SQLite3 is properly installed

### API Key Issues
- Ensure `.env` file exists in `backend/` directory
- Verify API key is correct and active
- Check backend console for error messages

### Export Issues
- PDF export requires PDFKit (included in dependencies)
- CSV export works with any number of records
- JSON export is always available

### CORS Issues
- CORS is enabled for localhost:3000
- If using different port, update CORS settings in `backend/index.js`

## Development Notes

- Database auto-syncs on server start (creates tables if needed)
- All timestamps are automatically managed by Sequelize
- Weather snapshots are stored as JSON strings in the database
- Export endpoints stream files directly to browser

## License

This project is created for educational purposes as part of Assignment 2.

---

**Created by Gagandeep Singh**


