import { useState } from "react";
import { translations } from "../utils/translations";

function Legend({ corridors, visibility, onToggle, stats, lang = 'id' }) {
    const t = translations[lang];
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`legend-panel ${collapsed ? "collapsed" : ""}`}>
            <div className="legend-header" onClick={() => setCollapsed(!collapsed)}>
                <h3>
                    <span className="legend-icon">🗺️</span>
                    {lang === 'id' ? 'Koridor MJT' : 'MJT Corridors'}
                </h3>
                <button className="legend-toggle">{collapsed ? "▶" : "▼"}</button>
            </div>

            {!collapsed && (
                <div className="legend-body">
                    {/* Stats */}
                    {stats && (
                        <div className="legend-stats">
                            <div className="stat-item">
                                <span className="stat-value">{stats.totalCorridors}</span>
                                <span className="stat-label">{t.stats_corridors}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{stats.totalStopPoints}</span>
                                <span className="stat-label">{t.stats_stops}</span>
                            </div>
                        </div>
                    )}

                    {/* Corridors */}
                    {corridors.map((corridor) => (
                        <label
                            key={corridor.id}
                            className={`legend-item ${visibility[corridor.id] ? "active" : "inactive"}`}
                        >
                            <input
                                type="checkbox"
                                checked={visibility[corridor.id]}
                                onChange={() => onToggle(corridor.id)}
                            />
                            <span className="legend-color" style={{ background: corridor.color }} />
                            <div className="legend-info">
                                <span className="legend-name">{corridor.name}</span>
                                <span className="legend-route">{corridor.route}</span>
                                <span className="legend-hours">⏰ {corridor.operatingHours}</span>
                                <span className="legend-stop-count">
                                    📍 {corridor.totalStopPoints} {lang === 'id' ? 'titik halte' : 'bus stops'}
                                </span>
                            </div>
                        </label>
                    ))}

                    {/* Symbols */}
                    <div className="legend-symbols">
                        <h4>{lang === 'id' ? 'Simbol' : 'Symbols'}</h4>
                        <div className="symbol-row">
                            <div className="symbol-terminal" />
                            <span>{lang === 'id' ? 'Terminal' : 'Terminal'}</span>
                        </div>
                        <div className="symbol-row">
                            <div className="symbol-stop" />
                            <span>{lang === 'id' ? 'Halte' : 'Bus Stop'}</span>
                        </div>
                        <div className="symbol-row">
                            <div className="symbol-transit" />
                            <span>{lang === 'id' ? 'Titik Transit' : 'Transit Point'}</span>
                        </div>
                        <div className="symbol-row">
                            <span className="symbol-dir-a">A</span>
                            <span>{lang === 'id' ? 'Halte A (Arah Tujuan)' : 'Stop A (Outbound)'}</span>
                        </div>
                        <div className="symbol-row">
                            <span className="symbol-dir-b">B</span>
                            <span>{lang === 'id' ? 'Halte B (Arah Kembali)' : 'Stop B (Inbound)'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Legend;