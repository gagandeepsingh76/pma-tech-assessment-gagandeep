/**
 * ForecastList Component
 * 
 * Displays 5-day weather forecast with:
 * - Date
 * - Min/Max temperatures
 * - Weather icon and condition
 */
function ForecastList({ forecast }) {
    if (!forecast || forecast.length === 0) {
        return null
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Check if it's today or tomorrow
        if (date.toDateString() === today.toDateString()) {
            return 'Today'
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow'
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        }
    }

    return (
        <div>
            <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '1.3rem' }}>
                5-Day Forecast
            </h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '15px'
            }}>
                {forecast.map((day, index) => {
                    const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`

                    return (
                        <div
                            key={index}
                            style={{
                                padding: '20px',
                                backgroundColor: '#f7fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                textAlign: 'center',
                                transition: 'transform 0.2s',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-5px)'
                                e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.boxShadow = 'none'
                            }}
                        >
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                                {formatDate(day.date)}
                            </div>
                            <img
                                src={iconUrl}
                                alt={day.condition}
                                style={{ width: '60px', height: '60px', margin: '10px auto' }}
                            />
                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px', textTransform: 'capitalize' }}>
                                {day.condition.toLowerCase()}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea' }}>
                                    {day.max}°
                                </span>
                                <span style={{ fontSize: '1rem', color: '#999' }}>
                                    {day.min}°
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ForecastList


