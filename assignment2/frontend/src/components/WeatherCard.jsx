/**
 * WeatherCard Component
 * 
 * Displays current weather information including:
 * - Temperature, feels-like temperature
 * - Weather description and icon
 * - Humidity, wind speed
 * - Sunrise and sunset times
 */
function WeatherCard({ data, onSave, showSaveButton = false }) {
    const { location, current, demo } = data

    const iconUrl = `https://openweathermap.org/img/wn/${current.icon}@2x.png`

    return (
        <div style={{
            marginBottom: '30px',
            padding: '25px',
            backgroundColor: '#f7fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
                    Current Weather: {location}
                </h2>
                {demo && (
                    <div style={{
                        padding: '6px 12px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                    }}>
                        🎭 DEMO MODE
                    </div>
                )}
            </div>
            {demo && (
                <div style={{
                    marginBottom: '15px',
                    padding: '12px',
                    backgroundColor: '#dbeafe',
                    border: '1px solid #93c5fd',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#1e40af'
                }}>
                    <strong>ℹ️ Demo Mode Active:</strong> This is mock data. To get real weather data, add your OpenWeatherMap API key to <code>assignment2/backend/.env</code>
                </div>
            )}

            {showSaveButton && onSave && (
                <div style={{ marginBottom: '15px' }}>
                    <button
                        onClick={onSave}
                        className="button button-success"
                    >
                        💾 Save This Record
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center' }}>
                {/* Main temperature and icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img
                        src={iconUrl}
                        alt={current.description}
                        style={{ width: '100px', height: '100px' }}
                    />
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
                            {current.temp_c}°C
                        </div>
                        <div style={{ fontSize: '1.1rem', color: '#666', textTransform: 'capitalize' }}>
                            {current.description}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#999', marginTop: '5px' }}>
                            Feels like {current.feels_like_c}°C
                        </div>
                    </div>
                </div>

                {/* Weather details */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Humidity</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                                {current.humidity}%
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Wind Speed</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                                {current.wind_m_s} m/s
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Sunrise</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                                {current.sunrise}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Sunset</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                                {current.sunset}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherCard


