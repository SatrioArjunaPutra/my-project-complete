import { useState, useCallback, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
  LayerGroup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  corridors,
  transitPoints,
  stats,
  MAP_CENTER,
  MAP_ZOOM,
} from "./data/routeData";
import CorridorLayer from "./components/CorridorLayer";
import Legend from "./components/Legend";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import LandingPage from "./components/LandingPage";
import RouteSearch from "./components/RouteSearch";
import "./App.css";

// Fix default marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Transit point icon
const transitIcon = L.divIcon({
  className: "custom-transit-icon",
  html: `<div style="
    width: 20px; height: 20px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 3px 12px rgba(255,165,0,0.6);
    position: relative;
  "><div style="
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 6px; height: 6px;
    background: white; border-radius: 50%;
  "></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -14],
});

// Selected stop highlight icon
const selectedIcon = L.divIcon({
  className: "custom-selected-icon",
  html: `<div class="selected-marker-pulse">
    <div class="selected-marker-inner"></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22],
});

// Fly-to component
function FlyToStop({ stop }) {
  const map = useMap();
  if (stop) {
    map.flyTo([stop.lat, stop.lng], 17, { duration: 1.5 });
  }
  return null;
}

// User Location Tracker Component
const userLocationIcon = L.divIcon({
  className: "custom-user-icon",
  html: `<div style="
    width: 16px; height: 16px;
    background-color: #4285F4;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(66, 133, 244, 0.8);
    position: relative;
    z-index: 1000;
  ">
    <div style="
      position: absolute;
      top: -12px; left: -12px; bottom: -12px; right: -12px;
      border: 2px solid rgba(66, 133, 244, 0.5);
      border-radius: 50%;
      animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    "></div>
  </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -15]
});

function UserLocationTracker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.log(err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <>
      <div 
        className="locate-me-btn" 
        onClick={() => {
           if (position) map.flyTo(position, 16, { duration: 1 });
           else alert("Sedang mencari lokasi atau akses ditolak. Pastikan GPS aktif!");
        }}
        title="Lacak Lokasi Saya"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      {position && (
        <Marker position={position} icon={userLocationIcon}>
           <Popup className="custom-popup">
             <div style={{fontWeight: 'bold', color: '#4285F4', textAlign: 'center'}}>
               📍 Posisi Anda<br/>Saat Ini
             </div>
           </Popup>
        </Marker>
      )}
    </>
  );
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [visibility, setVisibility] = useState(
    corridors.reduce((acc, c) => ({ ...acc, [c.id]: true }), {})
  );
  const [selectedStop, setSelectedStop] = useState(null);
  const [searchedRoute, setSearchedRoute] = useState(null);
  const mapRef = useRef();

  const toggleCorridor = (id) => {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectStop = useCallback((stop) => {
    setSelectedStop(stop);
    setTimeout(() => setSelectedStop(null), 10000);
  }, []);

  const handleRouteFound = (route) => {
    setSearchedRoute(route);
    if (mapRef.current && route.pathGeometry && route.pathGeometry.length > 0) {
      const bounds = L.latLngBounds(route.pathGeometry);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleRouteClear = () => {
    setSearchedRoute(null);
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-container">
      <Header stats={stats} onBack={() => setShowLanding(true)} />

      <div className="map-wrapper">
        <MapContainer
          ref={mapRef}
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          maxZoom={30}
          className="map-container"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxZoom={30}
            maxNativeZoom={20}
          />

          <UserLocationTracker />

          <FlyToStop stop={selectedStop} />

          {corridors.map((corridor) => (
            <CorridorLayer
              key={corridor.id}
              corridor={corridor}
              visible={visibility[corridor.id]}
            />
          ))}

          {/* Transit points */}
          {transitPoints.map((tp, index) => {
            const anyVisible = tp.corridors.some((cId) => visibility[cId]);
            if (!anyVisible) return null;
            return (
              <Marker
                key={`transit-${index}`}
                position={[tp.lat, tp.lng]}
                icon={transitIcon}
              >
                <Tooltip direction="top" offset={[0, -12]} className="custom-tooltip">
                  🔄 {tp.name}
                </Tooltip>
                <Popup className="custom-popup">
                  <div className="popup-content">
                    <div className="popup-corridor-badge" style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
                      Titik Transit
                    </div>
                    <h3 className="popup-title">{tp.name}</h3>
                    <p className="popup-type">🔄 Titik Transit Antar Koridor</p>
                    <div className="popup-corridors">
                      {tp.corridors.map((cId) => {
                        const c = corridors.find((cor) => cor.id === cId);
                        return (
                          <span key={cId} className="popup-corridor-tag" style={{ background: c.color }}>
                            {c.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Selected stop highlight */}
          {selectedStop && (
            <LayerGroup>
              <Marker position={[selectedStop.lat, selectedStop.lng]} icon={selectedIcon}>
                <Popup className="custom-popup" autoClose={false} autoPan={false}>
                  <div className="popup-content">
                    <div className="popup-corridor-badge" style={{ background: "#e94560" }}>
                      📍 Hasil Pencarian
                    </div>
                    <h3 className="popup-title">{selectedStop.fullName || selectedStop.name}</h3>
                    {selectedStop.direction && (
                      <div className="popup-direction-badge" data-dir={selectedStop.direction}>
                        Halte {selectedStop.direction}
                      </div>
                    )}
                    <table className="popup-attrs">
                      <tbody>
                        <tr><td>Koridor</td><td>{selectedStop.corridorName}</td></tr>
                        <tr><td>Rute</td><td>{selectedStop.corridorRoute}</td></tr>
                        <tr><td>Jenis</td><td>{selectedStop.facility}</td></tr>
                        <tr><td>Sistem</td><td>{selectedStop.system}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </Popup>
              </Marker>
            </LayerGroup>
          )}

          {/* Rendering the searched route on top of everything */}
          {searchedRoute && searchedRoute.pathGeometry && (
            <Polyline
              positions={searchedRoute.pathGeometry}
              pathOptions={{ color: "#3498db", weight: 8, opacity: 0.8 }}
              zIndexOffset={1000}
            >
              <Tooltip permanent direction="top" className="route-tooltip">
                <div style={{ textAlign: "center" }}>
                  <strong>{searchedRoute.totalDistance.toFixed(1)} km</strong>
                  <br />
                  <span>Jalur Rute</span>
                </div>
              </Tooltip>
            </Polyline>
          )}
        </MapContainer>

        <SearchBar corridors={corridors} onSelectStop={handleSelectStop} />

        <RouteSearch 
            corridors={corridors} 
            onRouteFound={handleRouteFound} 
            onRouteClear={handleRouteClear} 
        />

        <Legend
          corridors={corridors}
          visibility={visibility}
          onToggle={toggleCorridor}
          stats={stats}
        />
      </div>
    </div>
  );
}

export default App;
