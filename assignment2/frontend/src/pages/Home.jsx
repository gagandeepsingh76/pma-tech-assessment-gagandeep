import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LocationInput from '../components/LocationInput'
import CandidateList from '../components/CandidateList'
import WeatherCard from '../components/WeatherCard'
import ForecastList from '../components/ForecastList'

const API_BASE_URL = 'http://localhost:4000/api'

function Home() {
    const navigate = useNavigate()
    const [locationInput, setLocationInput] = useState('')
    const [candidates, setCandidates] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)

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

  /**
   * Handles saving the current weather as a record
   */
  const handleSaveRecord = async () => {
    if (!selectedLocation || !weatherData) {
      setError('No weather data to save')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const today = new Date().toISOString().split('T')[0]
      const locationName = selectedLocation.display_name || weatherData.location
      
      // Prompt for record name
      const recordName = prompt('Enter a name for this record:', locationName)
      if (!recordName || recordName.trim() === '') {
        setSaving(false)
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: recordName.trim(),
          location_input: locationInput.trim() || locationName,
          lat: selectedLocation.lat,
          lon: selectedLocation.lon,
          display_name: locationName,
          start_date: today,
          end_date: null,
          weather_snapshot: weatherData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save record')
      }

      // Show success and navigate to records page
      alert('Record saved successfully!')
      navigate('/records')
    } catch (err) {
      setError(err.message || 'Failed to save record')
      setSaving(false)
    }
  }

    return (
        <>
            <LocationInput
                value={locationInput}
                onChange={setLocationInput}
                onResolve={handleResolve}
                onUseMyLocation={handleUseMyLocation}
                loading={loading || saving}
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
                    <WeatherCard
                        data={weatherData}
                        onSave={handleSaveRecord}
                        showSaveButton={true}
                    />
                    <ForecastList forecast={weatherData.forecast} />
                </>
            )}
        </>
    )
}

export default Home


