const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * GET /api/integrations/youtube?query=<location>
 * 
 * Optional: Search YouTube for location-related videos
 */
router.get('/youtube', async (req, res) => {
    try {
        const { query } = req.query;
        const apiKey = process.env.YOUTUBE_API_KEY;

        if (!apiKey || apiKey === 'your_youtube_api_key_optional') {
            return res.status(503).json({
                error: 'YouTube API key not configured',
                message: 'This feature requires a YouTube API key'
            });
        }

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: `${query} travel weather`,
                type: 'video',
                maxResults: 5,
                key: apiKey
            }
        });

        const videos = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt
        }));

        res.json({ videos });

    } catch (error) {
        console.error('YouTube API error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch YouTube videos',
            message: error.message
        });
    }
});

/**
 * GET /api/integrations/maps?lat=<>&lon=<>
 * 
 * Optional: Get Google Maps embed URL
 */
router.get('/maps', (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        // Return Google Maps embed URL
        // If API key is provided, use Maps Embed API, otherwise use basic embed
        if (apiKey && apiKey !== 'your_google_maps_api_key_optional') {
            const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}`;
            res.json({ embedUrl, latitude, longitude });
        } else {
            // Fallback to basic embed (no API key needed)
            const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
            res.json({ embedUrl, latitude, longitude, note: 'Using basic embed (no API key)' });
        }

    } catch (error) {
        console.error('Maps integration error:', error.message);
        res.status(500).json({
            error: 'Failed to get maps URL',
            message: error.message
        });
    }
});

module.exports = router;


