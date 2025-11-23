/**
 * LocationInput Component
 * 
 * Provides input field for location search and buttons for:
 * - Resolving location (geocoding)
 * - Using device's current location
 */
function LocationInput({ value, onChange, onResolve, onUseMyLocation, loading }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            onResolve()
        }
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city, zip code, landmark, or coordinates (lat,lon)"
                    disabled={loading}
                    style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '12px',
                        fontSize: '1rem',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                <button
                    onClick={onResolve}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        fontSize: '1rem',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        opacity: loading ? 0.6 : 1,
                        transition: 'opacity 0.3s'
                    }}
                >
                    {loading ? 'Loading...' : 'Resolve'}
                </button>
                <button
                    onClick={onUseMyLocation}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        fontSize: '1rem',
                        backgroundColor: '#48bb78',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        opacity: loading ? 0.6 : 1,
                        transition: 'opacity 0.3s'
                    }}
                >
                    📍 Use my location
                </button>
            </div>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
                Examples: "New Delhi", "94040", "40.73061,-73.935242"
            </p>
        </div>
    )
}

export default LocationInput


