import { useState, useEffect } from 'react'
import EditRecordModal from '../components/EditRecordModal'
import ExportButtons from '../components/ExportButtons'
import WeatherSnapshotViewer from '../components/WeatherSnapshotViewer'
import LocationInput from '../components/LocationInput'
import CandidateList from '../components/CandidateList'

const API_BASE_URL = 'http://localhost:4000/api'

function Records() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Modal states
  const [editingRecord, setEditingRecord] = useState(null)
  const [viewingRecord, setViewingRecord] = useState(null)
  
  // Form state for creating
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location_input: '',
    lat: '',
    lon: '',
    display_name: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  })
  
  // Geocoding state
  const [locationInput, setLocationInput] = useState('')
  const [candidates, setCandidates] = useState([])
  const [geocoding, setGeocoding] = useState(false)
  const [saving, setSaving] = useState(false)

  /**
   * Fetch all records
   */
  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/records`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch records')
      }
      
      setRecords(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  /**
   * Handle geocoding for form
   */
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

  /**
   * Handle form submission (create)
   */
  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create record')
      }

      setSuccess('Record created successfully!')
      setShowCreateForm(false)
      setFormData({
        name: '',
        location_input: '',
        lat: '',
        lon: '',
        display_name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      })
      setLocationInput('')
      setCandidates([])
      fetchRecords()
    } catch (err) {
      setError(err.message || 'Failed to create record')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Handle edit
   */
  const handleEdit = (record) => {
    setEditingRecord(record)
  }

  /**
   * Handle delete
   */
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete record')
      }

      setSuccess('Record deleted successfully!')
      fetchRecords()
    } catch (err) {
      setError(err.message || 'Failed to delete record')
    }
  }

  /**
   * Handle view
   */
  const handleView = (record) => {
    setViewingRecord(record)
  }

  /**
   * Handle export success
   */
  const handleExportSuccess = (format, success, error) => {
    if (success) {
      setSuccess(`Record exported as ${format.toUpperCase()} successfully!`)
    } else {
      setError(error || `Failed to export as ${format.toUpperCase()}`)
    }
  }

  /**
   * Format date range
   */
  const formatDateRange = (start, end) => {
    if (!end) return start
    return `${start} - ${end}`
  }

  /**
   * Format timestamp
   */
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Saved Records</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="button button-primary"
          >
            {showCreateForm ? 'Cancel' : '+ New Record'}
          </button>
          <ExportButtons onExport={handleExportSuccess} />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showCreateForm && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f7fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Create New Record</h3>
          
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

          <form onSubmit={handleCreate}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
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
              <div>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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
                  End Date:
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={saving} className="button button-primary">
                {saving ? 'Creating...' : 'Create Record'}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="button button-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading records...</div>
      ) : records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No records yet. Create your first weather record!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Date Range</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Timestamp</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const snapshot = record.weather_snapshot
                const temp = snapshot?.current?.temp_c || 'N/A'
                
                return (
                  <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>{record.name}</td>
                    <td style={{ padding: '12px' }}>
                      <div>{record.display_name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {parseFloat(record.lat).toFixed(4)}, {parseFloat(record.lon).toFixed(4)}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{formatDateRange(record.start_date, record.end_date)}</td>
                    <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>
                      {formatTimestamp(record.saved_at)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleView(record)}
                          className="button button-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(record)}
                          className="button button-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="button button-danger"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          Delete
                        </button>
                        <ExportButtons recordId={record.id} onExport={handleExportSuccess} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={(updatedRecord) => {
            setSuccess('Record updated successfully!')
            fetchRecords()
          }}
        />
      )}

      {viewingRecord && (
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
          onClick={() => setViewingRecord(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>Record Details: {viewingRecord.name}</h2>
              <button
                onClick={() => setViewingRecord(null)}
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

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Location:</strong> {viewingRecord.display_name}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Coordinates:</strong> {parseFloat(viewingRecord.lat).toFixed(4)}, {parseFloat(viewingRecord.lon).toFixed(4)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Date Range:</strong> {formatDateRange(viewingRecord.start_date, viewingRecord.end_date)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Saved At:</strong> {formatTimestamp(viewingRecord.saved_at)}
              </div>
            </div>

            <WeatherSnapshotViewer snapshot={viewingRecord.weather_snapshot} />
          </div>
        </div>
      )}
    </>
  )
}

export default Records
