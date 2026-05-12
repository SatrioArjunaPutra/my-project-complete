import { Polyline, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";

// Create custom bus stop icon with A/B indicator
// Bikin icon halte bentuk BUS yang warnanya ngikutin koridor
  const createStopIcon = (color) => {
    return L.divIcon({
      className: "custom-mjt-bus-stop",
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background-color: white; 
          border: 2px solid ${color || '#333'}; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        ">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="${color || '#333'}">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
          </svg>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12], // Titik tengah
    });
  };

// Create terminal icon
const createTerminalIcon = (color, direction) =>
    L.divIcon({
        className: "custom-terminal-icon",
        html: `<div style="
      position: relative;
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 5px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
        <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
      </svg>
      <span style="
        position: absolute;
        top: -8px;
        right: -10px;
        font-size: 8px;
        font-weight: 800;
        color: ${direction === "A" ? "#2ecc71" : "#e74c3c"};
        background: white;
        border-radius: 3px;
        padding: 0 2px;
        line-height: 1.2;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      ">${direction}</span>
    </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14],
    });

function CorridorLayer({ corridor, visible, onRouteRequest, onSaveStop, savedStops = [] }) {
    if (!visible) return null;

    const isStopSaved = (stop) => {
        const uniqueId = `${stop.name}-${stop.lat}-${stop.lng}`;
        return savedStops.some(s => s.uniqueId === uniqueId);
    };

    return (
        <>
            {/* Route polyline */}
            <Polyline
                positions={corridor.path}
                pathOptions={{
                    color: corridor.color,
                    weight: 5,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round",
                }}
                smoothFactor={0}
            />

            {/* All halt stops (A and B) */}
            {corridor.stops.map((stop, index) => {
                const icon =
                    stop.type === "terminal"
                        ? createTerminalIcon(corridor.color, stop.direction)
                        : createStopIcon(corridor.color, stop.direction);

                const saved = isStopSaved(stop);

                return (
                    <Marker
                        key={`${corridor.id}-${index}`}
                        position={[stop.lat, stop.lng]}
                        icon={icon}
                    >
                        <Tooltip
                            direction="top"
                            offset={[0, -10]}
                            className="custom-tooltip"
                            permanent={false}
                        >
                            {stop.fullName}
                        </Tooltip>
                        <Popup className="gm-popup">
                            <div className="gm-popup-content">
                                <div className="gm-action-row">
                                    <div 
                                        className="gm-action-btn"
                                        onClick={() => onRouteRequest && onRouteRequest(stop)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="gm-action-icon bg-blue">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="white" d="M13.5 21L12 19.5 16.5 15H5v-4h2v2h9.5l-4.5-4.5L13.5 7l7 7z" /></svg>
                                        </div>
                                        <span>Rute</span>
                                    </div>
                                    <div 
                                        className="gm-action-btn"
                                        onClick={() => onSaveStop && onSaveStop(stop)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className={`gm-action-icon ${saved ? 'bg-orange' : ''}`} style={saved ? { color: 'white', backgroundColor: '#F39C12', borderColor: '#F39C12' } : {}}>
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                                        </div>
                                        <span style={saved ? { color: '#F39C12' } : {}}>{saved ? 'Disimpan' : 'Simpan'}</span>
                                    </div>
                                    <div className="gm-action-btn">
                                        <div className="gm-action-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                        </div>
                                        <span>Di Sekitar</span>
                                    </div>
                                    <div 
                                        className="gm-action-btn"
                                        onClick={() => {
                                            const shareText = `Halo! Cek lokasi halte ini di Metro Jabar Trans:\n\n📍 *${stop.name}*\n🚌 Koridor: ${corridor.name}\n\nLihat di Peta: https://www.google.com/maps?q=${stop.lat},${stop.lng}`;
                                            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="gm-action-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" /></svg>
                                        </div>
                                        <span>Bagikan</span>
                                    </div>
                                </div>
                                <div className="gm-info-list">
                                    <div className="gm-info-item">
                                        <div className="gm-info-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                        </div>
                                        <div className="gm-info-text gm-title">{stop.name}</div>
                                    </div>
                                    <div className="gm-info-item">
                                        <div className="gm-info-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
                                        </div>
                                        <div className="gm-info-text"><span className="gm-highlight">Buka</span> · {corridor.operatingHours}</div>
                                    </div>
                                    <div className="gm-info-item">
                                        <div className="gm-info-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 4H6v2l6.5 6L6 18v2h12v-3h-7l5-5-5-5h7z" /></svg>
                                        </div>
                                        <div className="gm-info-text">{corridor.name} - {corridor.route}</div>
                                    </div>
                                    <div className="gm-info-item">
                                        <div className="gm-info-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-8.5-9L2 6v2h19V6l-7.5-5z" /></svg>
                                        </div>
                                        <div className="gm-info-text">{stop.facility} ({stop.system})</div>
                                    </div>
                                    <div className="gm-info-item">
                                        <div className="gm-info-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" /></svg>
                                        </div>
                                        <div className="gm-info-text">Halte {stop.direction} ({stop.direction === "A" ? "Terminal Awal → Tujuan" : "Terminal Tujuan → Awal"})</div>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default CorridorLayer;