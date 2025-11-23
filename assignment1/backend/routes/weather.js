const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * Generates mock weather data for demo mode when API key is not configured
 */
function generateMockWeatherData(lat, lon) {
    const now = new Date();
    const locationName = `Demo Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;

    // Generate current weather
    const current = {
        temp_c: Math.round(20 + Math.random() * 10), // 20-30°C
        feels_like_c: Math.round(18 + Math.random() * 12),
        description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain'][Math.floor(Math.random() * 5)],
        icon: ['01d', '02d', '03d', '04d', '09d'][Math.floor(Math.random() * 5)],
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        wind_m_s: Math.round((2 + Math.random() * 5) * 10) / 10, // 2-7 m/s
        sunrise: '06:15 AM',
        sunset: '06:45 PM'
    };

    // Generate 5-day forecast
    const forecast = [];
    for (let i = 1; i <= 5; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        forecast.push({
            date: dateStr,
            min: Math.round(15 + Math.random() * 5), // 15-20°C
            max: Math.round(25 + Math.random() * 8), // 25-33°C
            icon: ['01d', '02d', '03d', '04d'][Math.floor(Math.random() * 4)],
            condition: ['Clear', 'Clouds', 'Rain', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
        });
    }

    return {
        location: locationName,
        current,
        forecast,
        demo: true // Flag to indicate this is mock data
    };
}

/**
 * GET /api/weather?lat=<>&lon=<>
 * 
 * Fetches current weather and 5-day forecast from OpenWeatherMap
 * Processes forecast into daily aggregates (min/max per day)
 * Falls back to mock data if API key is not configured (demo mode)
 */
router.get('/', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Valid lat and lon parameters are required' });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid coordinate range' });
        }

        const apiKey = process.env.OWM_KEY;
        const isDemoMode = !apiKey || apiKey === 'your_openweathermap_api_key';

        if (isDemoMode) {
            // Return mock data for demo purposes
            console.log('Demo mode: Returning mock weather data');
            return res.json(generateMockWeatherData(latitude, longitude));
        }

        // Fetch current weather and forecast in parallel
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

        // Process current weather
        const currentWeather = {
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
        };

        // Aggregate forecast by day
        // OpenWeatherMap returns 3-hour intervals, we need daily min/max
        const dailyForecast = {};

        forecast.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

            if (!dailyForecast[dateKey]) {
                dailyForecast[dateKey] = {
                    date: dateKey,
                    min: item.main.temp_min,
                    max: item.main.temp_max,
                    icons: [item.weather[0].icon],
                    conditions: [item.weather[0].main]
                };
            } else {
                // Update min/max for the day
                dailyForecast[dateKey].min = Math.min(dailyForecast[dateKey].min, item.main.temp_min);
                dailyForecast[dateKey].max = Math.max(dailyForecast[dateKey].max, item.main.temp_max);
                // Collect icons and conditions (we'll use the most common one)
                dailyForecast[dateKey].icons.push(item.weather[0].icon);
                dailyForecast[dateKey].conditions.push(item.weather[0].main);
            }
        });

        // Convert to array and format (skip today, show next 5 days)
        const today = new Date().toISOString().split('T')[0];
        const forecastArray = Object.values(dailyForecast)
            .filter(item => item.date !== today) // Exclude today
            .sort((a, b) => a.date.localeCompare(b.date)) // Sort by date
            .slice(0, 5) // Take next 5 days
            .map(item => {
                // Use the most common condition/icon for the day (simplified: use middle icon)
                return {
                    date: item.date,
                    min: Math.round(item.min),
                    max: Math.round(item.max),
                    icon: item.icons[Math.floor(item.icons.length / 2)], // Use middle icon
                    condition: item.conditions[0] // Use first condition
                };
            });

        // Get location name (use city name from current weather or coordinates)
        const locationName = current.name
            ? `${current.name}, ${current.sys.country || ''}`.trim()
            : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

        res.json({
            location: locationName,
            current: currentWeather,
            forecast: forecastArray
        });

    } catch (error) {
        console.error('Weather API error:', error.message);

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 401) {
                return res.status(401).json({
                    error: 'Invalid API key',
                    message: 'Please check your OpenWeatherMap API key'
                });
            } else if (status === 429) {
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: 'Too many requests. Please try again later.'
                });
            } else {
                return res.status(status).json({
                    error: 'Weather service error',
                    message: data.message || error.message
                });
            }
        } else if (error.request) {
            return res.status(503).json({
                error: 'Weather service unavailable',
                message: 'Unable to reach weather service'
            });
        } else {
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        }
    }
});

module.exports = router;

