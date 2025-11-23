import { useState, useEffect } from 'react'
import LocationInput from './LocationInput'
import CandidateList from './CandidateList'

const API_BASE_URL = 'http://localhost:4000/api'

/**
 * EditRecordModal Component
 * 
 * Modal for editing existing records
 */
function EditRecordModal({ record, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    location_input: '',
    lat: '',
    lon: '',
    display_name: '',
    start_date: '',
    end_date: ''
  })
  
  const [locationInput, setLocationInput] = useState('')
  const [candidates, setCandidates] = useState([])
  const [geocoding, setGeocoding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (record) {
      setFormData({
        name: record.name || '',
        location_input: record.location_input || '',
        lat: record.lat?.toString() || '',
        lon: record.lon?.toString() || '',
        display_name: record.display_name || '',
        start_date: record.start_date || '',
        end_date: record.end_date || ''
      })
    }
  }, [record])

  const handleGeocode = async () => {
    if (!locationInput.trim()) {
      setError('Please enter a location')
      return
    }

    setGeocoding(true)
    setError(null)
    setCandidates([])

    try {
      const response = await fetch(`${API_BASE_URL}/geocode?query=${encodeURIComponent(locationInput.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Geocoding failed')
      }

      if (data.length === 0) {
        setError('No locations found. Please try a different search term.')
        setGeocoding(false)
        return
      }

      if (data.length === 1) {
        setFormData({
          ...formData,
          location_input: locationInput.trim(),
          display_name: data[0].display_name,
          lat: data[0].lat.toString(),
          lon: data[0].lon.toString()
        })
        setLocationInput('')
        setCandidates([])
      } else {
        setCandidates(data)
      }
      setGeocoding(false)
    } catch (err) {
      setError(err.message || 'Failed to geocode location')
      setGeocoding(false)
    }
  }

  const handleCandidateSelect = (candidate) => {
    setFormData({
      ...formData,
      location_input: locationInput.trim(),
      display_name: candidate.display_name,
      lat: candidate.lat.toString(),
      lon: candidate.lon.toString()
    })
    setLocationInput('')
    setCandidates([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/records/${record.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update record')
      }

      onSave(data)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update record')
      setLoading(false)
    }
  }

  if (!record) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Edit Record</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '30px',
              height: '30px'
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Search Location:
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter location to geocode"
              style={{
                flex: 1,
                padding: '8px',
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <button
              type="button"
              onClick={handleGeocode}
              disabled={geocoding}
              className="button button-primary"
            >
              {geocoding ? 'Loading...' : 'Search'}
            </button>
          </div>
          {candidates.length > 0 && (
            <CandidateList candidates={candidates} onSelect={handleCandidateSelect} />
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Name: *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Location Input: *
            </label>
            <input
              type="text"
              value={formData.location_input}
              onChange={(e) => setFormData({ ...formData, location_input: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Display Name: *
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Latitude: *
              </label>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Longitude: *
              </label>
              <input
                type="number"
                step="any"
                value={formData.lon}
                onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Start Date: *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                End Date (optional):
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" disabled={loading} className="button button-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="button button-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRecordModal

