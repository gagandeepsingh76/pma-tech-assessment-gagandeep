# Weather Records Backend

Backend API server for the Weather Records Assignment 2. Handles geocoding, weather data, database operations, and exports.

## Tech Stack

- **Node.js** with Express.js
- **Sequelize ORM** with SQLite
- **Axios** for HTTP requests
- **PDFKit** for PDF generation
- **dotenv** for environment variable management
- **CORS** enabled for frontend communication

## Setup & Run Instructions

### 1. Install Dependencies

```bash
cd assignment2/backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
PORT=4000
OWM_KEY=your_actual_openweathermap_api_key_here
GEOCODER_USER_AGENT=WeatherApp/1.0
DB_PATH=./database.sqlite
YOUTUBE_API_KEY=your_youtube_api_key_optional
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_optional
```

**Getting an OpenWeatherMap API Key:**
1. Sign up at https://openweathermap.org/api
2. Get your free API key from the dashboard
3. Add it to the `.env` file

**Note:** YouTube and Google Maps API keys are optional. The app works without them.

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

**Database:** The SQLite database file (`database.sqlite`) will be created automatically on first run.

## API Endpoints

### Records CRUD

#### POST /api/records
Creates a new weather record.

**Request Body:**
```json
{
  "location": "New Delhi, India",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "date": "2024-01-15",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "id": 1,
  "location": "New Delhi, India",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "date": "2024-01-15",
  "weatherSnapshot": { ... },
  "notes": "Optional notes",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### GET /api/records
Gets all records with optional filtering.

**Query Parameters:**
- `location` (optional): Filter by location name (partial match)
- `startDate` (optional): Filter records from this date
- `endDate` (optional): Filter records until this date

#### GET /api/records/:id
Gets a single record by ID.

#### PUT /api/records/:id
Updates an existing record.

**Request Body:** Same as POST, all fields optional.

#### DELETE /api/records/:id
Deletes a record by ID.

### Export Endpoints

#### GET /api/export/json
Exports all records as JSON file.

#### GET /api/export/csv
Exports all records as CSV file.

#### GET /api/export/pdf
Exports all records as PDF file.

### Optional Integrations

#### GET /api/integrations/youtube?query=<location>
Searches YouTube for location-related videos. Requires `YOUTUBE_API_KEY`.

#### GET /api/integrations/maps?lat=<>&lon=<>
Returns Google Maps embed URL. Works without API key (basic embed), enhanced with `GOOGLE_MAPS_API_KEY`.

## Database

The application uses SQLite with Sequelize ORM. The database file is stored at `DB_PATH` (default: `./database.sqlite`).

**Record Model:**
- Stores location, coordinates, date, weather snapshot (JSON), and optional notes
- Automatic timestamps (createdAt, updatedAt)
- Weather snapshot is stored as JSON string and automatically parsed when retrieved

## Troubleshooting

### Database Connection Issues
- Ensure SQLite3 is properly installed: `npm install sqlite3`
- Check file permissions for database file location
- Delete `database.sqlite` and restart server to reset database

### API Key Issues
- Verify `.env` file exists and contains valid keys
- Check server console for API key warnings
- Demo mode works without OpenWeatherMap API key

### Export Issues
- PDF export requires PDFKit (included in dependencies)
- Large exports may take time - be patient
- Check browser console for download errors

## Health Check

Visit `http://localhost:4000/health` to verify:
- Server status
- API key configuration
- Database connection status


