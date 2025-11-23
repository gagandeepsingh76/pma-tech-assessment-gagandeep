require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const geocodeRouter = require('./routes/geocode');
const weatherRouter = require('./routes/weather');
const recordsRouter = require('./routes/records');
const exportRouter = require('./routes/export');
const integrationsRouter = require('./routes/integrations');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Check for API key on startup
const apiKey = process.env.OWM_KEY;
if (!apiKey || apiKey === 'your_openweathermap_api_key') {
    console.warn('\n⚠️  WARNING: OpenWeatherMap API key not configured!');
    console.warn('   Demo mode is enabled - weather requests will return mock data.\n');
} else {
    console.log('✅ OpenWeatherMap API key configured');
}

// Routes
app.use('/api/geocode', geocodeRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/records', recordsRouter);
app.use('/api', exportRouter); // Handles both /api/export/* and /api/records/:id/export
app.use('/api/integrations', integrationsRouter);

// Health check
app.get('/health', async (req, res) => {
    const hasApiKey = apiKey && apiKey !== 'your_openweathermap_api_key';
    try {
        await sequelize.authenticate();
        res.json({
            status: 'ok',
            message: 'Weather API is running',
            apiKeyConfigured: hasApiKey,
            database: 'connected'
        });
    } catch (error) {
        res.json({
            status: 'ok',
            message: 'Weather API is running',
            apiKeyConfigured: hasApiKey,
            database: 'error'
        });
    }
});

// Initialize database and start server
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Sync database (creates tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized');

        app.listen(PORT, () => {
            console.log(`Backend server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to database:', error);
        process.exit(1);
    }
}

startServer();

