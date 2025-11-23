require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geocodeRouter = require('./routes/geocode');
const weatherRouter = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 4000;

// Check for API key on startup
const apiKey = process.env.OWM_KEY;
if (!apiKey || apiKey === 'your_openweathermap_api_key') {
    console.warn('\n⚠️  WARNING: OpenWeatherMap API key not configured!');
    console.warn('   To fix this:');
    console.warn('   1. Edit assignment1/backend/.env');
    console.warn('   2. Replace "your_openweathermap_api_key" with your actual API key');
    console.warn('   3. Get a free API key at: https://openweathermap.org/api');
    console.warn('   4. Restart the server\n');
    console.warn('   Demo mode is enabled - weather requests will return mock data.\n');
} else {
    console.log('✅ OpenWeatherMap API key configured');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/geocode', geocodeRouter);
app.use('/api/weather', weatherRouter);

// Health check
app.get('/health', (req, res) => {
    const hasApiKey = apiKey && apiKey !== 'your_openweathermap_api_key';
    res.json({
        status: 'ok',
        message: 'Weather API is running',
        apiKeyConfigured: hasApiKey
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

