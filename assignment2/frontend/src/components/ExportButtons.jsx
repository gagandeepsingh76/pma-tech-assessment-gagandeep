/**
 * ExportButtons Component
 * 
 * Provides export buttons for a single record or all records
 */
function ExportButtons({ recordId = null, onExport }) {
  const handleExport = async (format) => {
    try {
      let url
      if (recordId) {
        url = `http://localhost:4000/api/records/${recordId}/export?format=${format}`
      } else {
        url = `http://localhost:4000/api/export/${format}`
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url_obj = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url_obj
      
      const filename = recordId 
        ? `record-${recordId}.${format}`
        : `weather-records-${new Date().toISOString().split('T')[0]}.${format}`
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url_obj)
      document.body.removeChild(a)
      
      if (onExport) {
        onExport(format, true)
      }
    } catch (err) {
      if (onExport) {
        onExport(format, false, err.message)
      } else {
        alert(`Failed to export: ${err.message}`)
      }
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <button
        onClick={() => handleExport('json')}
        className="button button-secondary"
        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        title="Export as JSON"
      >
        📄 JSON
      </button>
      <button
        onClick={() => handleExport('csv')}
        className="button button-secondary"
        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        title="Export as CSV"
      >
        📊 CSV
      </button>
      <button
        onClick={() => handleExport('pdf')}
        className="button button-secondary"
        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        title="Export as PDF"
      >
        📑 PDF
      </button>
    </div>
  )
}

export default ExportButtons

