const express = require('express');
const router = express.Router();
const { Record, sequelize } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');

/**
 * POST /api/records
 * 
 * Creates a new weather record
 * Body: { name, location_input, lat, lon, display_name, start_date, end_date? }
 */
router.post('/', async (req, res) => {
    try {
        const { name, location_input, lat, lon, display_name, start_date, end_date } = req.body;

        // Validation
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (!location_input || location_input.trim() === '') {
            return res.status(400).json({ error: 'Location input is required' });
        }

        if (!display_name || display_name.trim() === '') {
            return res.status(400).json({ error: 'Display name is required' });
        }

        if (lat === undefined || lon === undefined) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude' });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid coordinate range' });
        }

        // Validate dates
        if (!start_date) {
            return res.status(400).json({ error: 'Start date is required' });
        }

        const startDate = new Date(start_date);
        if (isNaN(startDate.getTime())) {
            return res.status(400).json({ error: 'Invalid start date format' });
        }

        let endDate = null;
        if (end_date) {
            endDate = new Date(end_date);
            if (isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Invalid end date format' });
            }
            if (endDate < startDate) {
                return res.status(400).json({ error: 'End date must be after start date' });
            }
        }

        // Fetch weather data for the snapshot
        let weatherSnapshot;
        try {
            const apiKey = process.env.OWM_KEY;
            const isDemoMode = !apiKey || apiKey === 'your_openweathermap_api_key';
            
            if (isDemoMode) {
                // Generate mock data
                weatherSnapshot = {
                    location: display_name,
                    current: {
                        temp_c: Math.round(20 + Math.random() * 10),
                        feels_like_c: Math.round(18 + Math.random() * 12),
                        description: ['clear sky', 'few clouds', 'scattered clouds'][Math.floor(Math.random() * 3)],
                        icon: '01d',
                        humidity: Math.round(40 + Math.random() * 40),
                        wind_m_s: Math.round((2 + Math.random() * 5) * 10) / 10,
                        sunrise: '06:15 AM',
                        sunset: '06:45 PM'
                    },
                    forecast: [],
                    demo: true
                };
            } else {
                // Fetch real weather data
                const [currentResponse, forecastResponse] = await Promise.all([
                    axios.get('https://api.openweathermap.org/data/2.5/weather', {
                        params: {
                            lat: latitude,
                            lon: longitude,
                            appid: apiKey,
                            units: 'metric'
                        }
                    }),
                    axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                        params: {
                            lat: latitude,
                            lon: longitude,
                            appid: apiKey,
                            units: 'metric'
                        }
                    })
                ]);

                const current = currentResponse.data;
                const forecast = forecastResponse.data;

                weatherSnapshot = {
                    location: display_name,
                    current: {
                        temp_c: Math.round(current.main.temp),
                        feels_like_c: Math.round(current.main.feels_like),
                        description: current.weather[0].description,
                        icon: current.weather[0].icon,
                        humidity: current.main.humidity,
                        wind_m_s: Math.round(current.wind.speed * 10) / 10,
                        sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    },
                    forecast: forecast.list.slice(0, 5).map(item => ({
                        date: new Date(item.dt * 1000).toISOString().split('T')[0],
                        temp: Math.round(item.main.temp),
                        description: item.weather[0].description,
                        icon: item.weather[0].icon
                    })),
                    demo: false
                };
            }
        } catch (weatherError) {
            console.error('Error fetching weather for record:', weatherError.message);
            weatherSnapshot = {
                error: 'Failed to fetch weather data',
                message: weatherError.message
            };
        }

        // Create record
        const record = await Record.create({
            name: name.trim(),
            location_input: location_input.trim(),
            lat: latitude,
            lon: longitude,
            display_name: display_name.trim(),
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate ? endDate.toISOString().split('T')[0] : null,
            saved_at: new Date(),
            weather_snapshot: weatherSnapshot
        });

        res.status(201).json({
            id: record.id,
            name: record.name,
            location_input: record.location_input,
            lat: parseFloat(record.lat),
            lon: parseFloat(record.lon),
            display_name: record.display_name,
            start_date: record.start_date,
            end_date: record.end_date,
            saved_at: record.saved_at,
            weather_snapshot: record.weather_snapshot
        });

    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({
            error: 'Failed to create record',
            message: error.message
        });
    }
});

/**
 * GET /api/records
 * 
 * Gets all records with optional filtering
 */
router.get('/', async (req, res) => {
    try {
        const { name, location, startDate, endDate } = req.query;
        
        const where = {};
        
        if (name) {
            where.name = { [Op.like]: `%${name}%` };
        }
        
        if (location) {
            where.display_name = { [Op.like]: `%${location}%` };
        }
        
        if (startDate || endDate) {
            where.start_date = {};
            if (startDate) {
                where.start_date[Op.gte] = startDate;
            }
            if (endDate) {
                where.start_date[Op.lte] = endDate;
            }
        }

        const records = await Record.findAll({
            where,
            order: [['saved_at', 'DESC']]
        });

        res.json(records.map(record => ({
            id: record.id,
            name: record.name,
            location_input: record.location_input,
            lat: parseFloat(record.lat),
            lon: parseFloat(record.lon),
            display_name: record.display_name,
            start_date: record.start_date,
            end_date: record.end_date,
            saved_at: record.saved_at,
            weather_snapshot: record.weather_snapshot
        })));

    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({
            error: 'Failed to fetch records',
            message: error.message
        });
    }
});

/**
 * GET /api/records/:id
 * 
 * Gets a single record by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const record = await Record.findByPk(id);
        
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json({
            id: record.id,
            name: record.name,
            location_input: record.location_input,
            lat: parseFloat(record.lat),
            lon: parseFloat(record.lon),
            display_name: record.display_name,
            start_date: record.start_date,
            end_date: record.end_date,
            saved_at: record.saved_at,
            weather_snapshot: record.weather_snapshot
        });

    } catch (error) {
        console.error('Error fetching record:', error);
        res.status(500).json({
            error: 'Failed to fetch record',
            message: error.message
        });
    }
});

/**
 * PUT /api/records/:id
 * 
 * Updates an existing record
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location_input, lat, lon, display_name, start_date, end_date } = req.body;
        
        const record = await Record.findByPk(id);
        
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // Update fields if provided
        if (name !== undefined) {
            if (name.trim() === '') {
                return res.status(400).json({ error: 'Name cannot be empty' });
            }
            record.name = name.trim();
        }

        if (location_input !== undefined) {
            if (location_input.trim() === '') {
                return res.status(400).json({ error: 'Location input cannot be empty' });
            }
            record.location_input = location_input.trim();
        }

        if (display_name !== undefined) {
            if (display_name.trim() === '') {
                return res.status(400).json({ error: 'Display name cannot be empty' });
            }
            record.display_name = display_name.trim();
        }

        if (lat !== undefined || lon !== undefined) {
            const latitude = lat !== undefined ? parseFloat(lat) : parseFloat(record.lat);
            const longitude = lon !== undefined ? parseFloat(lon) : parseFloat(record.lon);

            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ error: 'Invalid latitude or longitude' });
            }

            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                return res.status(400).json({ error: 'Invalid coordinate range' });
            }

            record.lat = latitude;
            record.lon = longitude;
        }

        if (start_date !== undefined) {
            const startDate = new Date(start_date);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({ error: 'Invalid start date format' });
            }
            record.start_date = startDate.toISOString().split('T')[0];
        }

        if (end_date !== undefined) {
            if (end_date === null || end_date === '') {
                record.end_date = null;
            } else {
                const endDate = new Date(end_date);
                if (isNaN(endDate.getTime())) {
                    return res.status(400).json({ error: 'Invalid end date format' });
                }
                if (endDate < new Date(record.start_date)) {
                    return res.status(400).json({ error: 'End date must be after start date' });
                }
                record.end_date = endDate.toISOString().split('T')[0];
            }
        }

        await record.save();

        res.json({
            id: record.id,
            name: record.name,
            location_input: record.location_input,
            lat: parseFloat(record.lat),
            lon: parseFloat(record.lon),
            display_name: record.display_name,
            start_date: record.start_date,
            end_date: record.end_date,
            saved_at: record.saved_at,
            weather_snapshot: record.weather_snapshot
        });

    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({
            error: 'Failed to update record',
            message: error.message
        });
    }
});

/**
 * DELETE /api/records/:id
 * 
 * Deletes a record by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const record = await Record.findByPk(id);
        
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        await record.destroy();

        res.json({ message: 'Record deleted successfully' });

    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({
            error: 'Failed to delete record',
            message: error.message
        });
    }
});

module.exports = router;
