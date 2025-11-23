import { useState } from 'react'
import LocationInput from './components/LocationInput'
import CandidateList from './components/CandidateList'
import WeatherCard from './components/WeatherCard'
import ForecastList from './components/ForecastList'
import InfoModal from './components/InfoModal'

const API_BASE_URL = 'http://localhost:4000/api'

function App() {
    const [locationInput, setLocationInput] = useState('')
    const [candidates, setCandidates] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showInfoModal, setShowInfoModal] = useState(false)

    /**
     * Handles geocoding request when user clicks "Resolve"
     */
    const handleResolve = async () => {
        if (!locationInput.trim()) {
            setError('Please enter a location')
            return
        }

        setLoading(true)
        setError(null)
        setCandidates([])
        setWeatherData(null)

        try {
            const response = await fetch(`${API_BASE_URL}/geocode?query=${encodeURIComponent(locationInput.trim())}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Geocoding failed')
            }

            if (data.length === 0) {
                setError('No locations found. Please try a different search term.')
                setLoading(false)
                return
            }

            // If only one result, use it directly
            if (data.length === 1) {
                fetchWeather(data[0].lat, data[0].lon, data[0].display_name)
            } else {
                // Multiple candidates - show selection list
                setCandidates(data)
                setLoading(false)
            }
        } catch (err) {
            setError(err.message || 'Failed to geocode location')
            setLoading(false)
        }
    }

    /**
     * Handles "Use my location" button click
     */
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            return
        }

        setLoading(true)
        setError(null)
        setCandidates([])
        setWeatherData(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                fetchWeather(latitude, longitude, 'Your Location')
            },
            (err) => {
                setError('Location access denied. Please allow location access or use manual input.')
                setLoading(false)
            }
        )
    }

    /**
     * Fetches weather data for given coordinates
     */
    const fetchWeather = async (lat, lon, displayName) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch weather')
            }

            // Override location name if we have a better one
            if (displayName && displayName !== 'Your Location') {
                data.location = displayName
            }

            setWeatherData(data)
            setSelectedLocation({ lat, lon, display_name: displayName || data.location })
            setCandidates([])
            setLoading(false)

            // Clear any previous errors if we got data (even if demo mode)
            if (data.demo) {
                setError(null) // Clear error since demo mode provides data
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch weather data')
            setLoading(false)
        }
    }

    /**
     * Handles candidate selection from CandidateList
     */
    const handleCandidateSelect = (candidate) => {
        fetchWeather(candidate.lat, candidate.lon, candidate.display_name)
    }

    return (
        <div className="app-container">
            <header className="header">
                <h1>🌤️ Weather App</h1>
                <p>Get current weather and 5-day forecast for any location</p>
            </header>

            <main className="main-content">
                <LocationInput
                    value={locationInput}
                    onChange={setLocationInput}
                    onResolve={handleResolve}
                    onUseMyLocation={handleUseMyLocation}
                    loading={loading}
                />

                {error && <div className="error-message">{error}</div>}

                {loading && !weatherData && <div className="loading">Loading weather data...</div>}

                {candidates.length > 0 && (
                    <CandidateList
                        candidates={candidates}
                        onSelect={handleCandidateSelect}
                    />
                )}

                {weatherData && (
                    <>
                        <WeatherCard data={weatherData} />
                        <ForecastList forecast={weatherData.forecast} />
                    </>
                )}
            </main>

            <footer className="footer">
                <span className="footer-text">Created by Gagandeep Singh</span>
                <button
                    className="info-button"
                    onClick={() => setShowInfoModal(true)}
                    aria-label="Show information"
                >
                    ℹ️ Info
                </button>
            </footer>

            {showInfoModal && (
                <InfoModal
                    onClose={() => setShowInfoModal(false)}
                />
            )}
        </div>
    )
}

export default App

