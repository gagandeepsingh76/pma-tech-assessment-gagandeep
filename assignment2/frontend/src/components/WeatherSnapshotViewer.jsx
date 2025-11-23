/**
 * WeatherSnapshotViewer Component
 * 
 * Displays weather snapshot data from a saved record
 */
function WeatherSnapshotViewer({ snapshot }) {
  if (!snapshot) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        No weather snapshot available
      </div>
    )
  }

  if (snapshot.error) {
    return (
      <div className="error-message">
        Error: {snapshot.message || snapshot.error}
      </div>
    )
  }

  const current = snapshot.current
  if (!current) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Weather data not available
      </div>
    )
  }

  const iconUrl = `https://openweathermap.org/img/wn/${current.icon}@2x.png`

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f7fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>Weather Snapshot</h3>
      
      {snapshot.demo && (
        <div style={{
          marginBottom: '15px',
          padding: '8px',
          backgroundColor: '#fef3c7',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#92400e'
        }}>
          🎭 Demo Mode Data
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img
            src={iconUrl}
            alt={current.description}
            style={{ width: '80px', height: '80px' }}
          />
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {current.temp_c}°C
            </div>
            <div style={{ fontSize: '1rem', color: '#666', textTransform: 'capitalize' }}>
              {current.description}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '5px' }}>
              Feels like {current.feels_like_c}°C
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Humidity</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                {current.humidity}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Wind Speed</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                {current.wind_m_s} m/s
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Sunrise</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                {current.sunrise}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Sunset</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                {current.sunset}
              </div>
            </div>
          </div>
        </div>
      </div>

      {snapshot.forecast && snapshot.forecast.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#333', fontSize: '1rem' }}>Forecast</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {snapshot.forecast.slice(0, 5).map((item, index) => {
              const iconUrl = `https://openweathermap.org/img/wn/${item.icon}@2x.png`
              return (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    minWidth: '100px'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '5px' }}>
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <img src={iconUrl} alt={item.description} style={{ width: '40px', height: '40px' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#667eea' }}>
                    {item.temp}°C
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'capitalize' }}>
                    {item.description}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherSnapshotViewer

