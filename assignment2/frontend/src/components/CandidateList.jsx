/**
 * CandidateList Component
 * 
 * Displays multiple geocoding results when location query is ambiguous.
 * User must select one candidate before fetching weather.
 */
function CandidateList({ candidates, onSelect }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>
                Multiple locations found. Please select one:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {candidates.map((candidate, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(candidate)}
                        style={{
                            padding: '15px',
                            textAlign: 'left',
                            backgroundColor: '#f7fafc',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            fontSize: '0.95rem'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#edf2f7'
                            e.target.style.borderColor = '#667eea'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f7fafc'
                            e.target.style.borderColor = '#e2e8f0'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                            {candidate.display_name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                            Coordinates: {candidate.lat.toFixed(4)}, {candidate.lon.toFixed(4)}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CandidateList


