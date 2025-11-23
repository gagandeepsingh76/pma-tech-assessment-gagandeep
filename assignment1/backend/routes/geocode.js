const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * GET /api/geocode?query=<text>
 * 
 * Handles geocoding requests:
 * - If query is coordinates (lat,lon), parse and return directly
 * - Otherwise, use Nominatim (OpenStreetMap) to search for locations
 * - Returns up to 5 candidate locations
 */
router.get('/', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const trimmedQuery = query.trim();

        // Check if query is coordinates (lat,lon format)
        const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
        if (coordPattern.test(trimmedQuery)) {
            const [lat, lon] = trimmedQuery.split(',').map(Number);

            // Validate coordinate ranges
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                return res.status(400).json({ error: 'Invalid coordinate range' });
            }

            return res.json([{
                lat,
                lon,
                display_name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
            }]);
        }

        // Use Nominatim for text-based geocoding
        const userAgent = process.env.GEOCODER_USER_AGENT || 'WeatherApp/1.0';

        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: trimmedQuery,
                format: 'json',
                limit: 5,
                addressdetails: 1
            },
            headers: {
                'User-Agent': userAgent
            }
        });

        if (!response.data || response.data.length === 0) {
            return res.json([]);
        }

        // Transform Nominatim results to our format
        const results = response.data.map(item => ({
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            display_name: item.display_name
        }));

        res.json(results);

    } catch (error) {
        console.error('Geocoding error:', error.message);

        if (error.response) {
            // API error response
            res.status(error.response.status || 500).json({
                error: 'Geocoding service error',
                message: error.message
            });
        } else if (error.request) {
            // Network error
            res.status(503).json({
                error: 'Geocoding service unavailable',
                message: 'Unable to reach geocoding service'
            });
        } else {
            // Other error
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
});

module.exports = router;


