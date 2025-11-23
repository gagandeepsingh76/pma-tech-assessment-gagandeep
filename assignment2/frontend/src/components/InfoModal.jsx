/**
 * InfoModal Component
 * 
 * Displays information about the Product Manager Accelerator
 * with a link to their LinkedIn page.
 */
function InfoModal({ onClose }) {
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
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#333' }}>About This App</h2>
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

                <p style={{ marginBottom: '20px', lineHeight: '1.6', color: '#555' }}>
                    This weather records app was created as Assignment 2 for the Product Manager Accelerator program.
                </p>

                <p style={{ marginBottom: '20px', lineHeight: '1.6', color: '#555' }}>
                    Learn more about Product Manager Accelerator:
                </p>

                <a
                    href="https://www.linkedin.com/company/product-manager-accelerator"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
                >
                    Visit LinkedIn Page →
                </a>
            </div>
        </div>
    )
}

export default InfoModal


