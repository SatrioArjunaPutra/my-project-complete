function Header({ stats, onBack }) {
    return (
        <header className="app-header">
            <div className="header-content">
                <div className="header-logo">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="header-back-btn"
                            title="Kembali ke Beranda"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>
                    )}
                    <img src="/mjt-logo.png" alt="MJT Logo" className="header-logo-img" />
                    <div className="header-title-group">
                        <h1>Peta Rute Metro Jabar Trans</h1>
                        <p className="header-subtitle">
                            Sistem Bus Rapid Transit — Bandung Raya, Jawa Barat
                        </p>
                    </div>
                </div>
                <div className="header-stats">
                    <div className="header-badge">
                        <span>{stats?.totalCorridors || 6} Koridor</span>
                        <span className="header-divider">|</span>
                        <span>{stats?.totalStopPoints || 0} Titik Halte</span>
                        <span className="header-divider">|</span>
                        <span>{stats?.totalUniqueLocations || 0} Lokasi</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
