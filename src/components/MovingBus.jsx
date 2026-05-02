import React, { useState, useEffect, useRef } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

const MovingBus = ({ path, color, busNumber, stops = [] }) => {
  const [position, setPosition] = useState(path[0]);
  const [rotation, setRotation] = useState(0);
  const [nextStop, setNextStop] = useState(null);
  const indexRef = useRef(0);
  const progressRef = useRef(0);
  // Pre-calculate stop indices on path and sort stops by their appearance
  const sortedStops = React.useMemo(() => {
    if (!stops.length || !path.length) return [];
    
    const mapped = stops.map(stop => {
      let minIndex = 0;
      let minDist = Infinity;
      // Optimize: check every few points if path is very long, but for accuracy we check all
      path.forEach((p, i) => {
        const d = Math.pow(p[0] - stop.lat, 2) + Math.pow(p[1] - stop.lng, 2);
        if (d < minDist) {
          minDist = d;
          minIndex = i;
        }
      });
      return { stop, index: minIndex };
    });

    // Sort stops by their index on the path
    return mapped.sort((a, b) => a.index - b.index);
  }, [stops, path]);

  useEffect(() => {
    if (!path || path.length < 2) return;

    const fps = 60;
    const interval = 1000 / fps;
    const speed = 0.003;

    const moveBus = setInterval(() => {
      const currentIndex = indexRef.current;
      const nextIndex = (currentIndex + 1) % path.length;
      
      const p1 = path[currentIndex];
      const p2 = path[nextIndex];

      if (!p1 || !p2) return;

      // Increment progress
      progressRef.current += speed;

      if (progressRef.current >= 1) {
        progressRef.current = 0;
        indexRef.current = nextIndex;
      }

      // Find next stop based on current index (reactive every frame)
      const currentIdxOnPath = indexRef.current;
      const nextItem = sortedStops.find(s => s.index > currentIdxOnPath);
      
      if (nextItem) {
        setNextStop(nextItem.stop);
      } else if (sortedStops.length > 0) {
        // If we passed all stops, next is the first stop (loop)
        setNextStop(sortedStops[0].stop);
      }

      // Interpolate Lat/Lng
      const currentLat = p1[0] + (p2[0] - p1[0]) * progressRef.current;
      const currentLng = p1[1] + (p2[1] - p1[1]) * progressRef.current;
      
      setPosition([currentLat, currentLng]);

      // Calculate Rotation
      const dLat = p2[0] - p1[0];
      const dLng = p2[1] - p1[1];
      const angle = Math.atan2(dLat, dLng) * (180 / Math.PI);
      setRotation(-angle);

    }, interval);

    return () => clearInterval(moveBus);
  }, [path, sortedStops, stops]);

  const busIcon = L.divIcon({
    className: 'custom-bus-container',
    html: `
      <div style="
        position: relative;
        width: 75px; height: 40px;
        margin-left: -37.5px; margin-top: -20px;
        transform: rotate(${rotation}deg);
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          position: absolute; width: 60px; height: 12px;
          background: rgba(0,0,0,0.25); filter: blur(4px); border-radius: 50%;
          bottom: 5px; z-index: -1;
        "></div>
        <img src="/mjt_bus_new_final.png" style="width: 75px; height: auto;" alt="bus" />
        <div style="
          position: absolute; top: -20px; left: 50%;
          transform: translateX(-50%) rotate(${-rotation}deg);
          background: ${color}; color: white;
          padding: 1px 6px; border-radius: 4px;
          font-size: 10px; font-weight: 900;
          border: 1px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        ">${busNumber}</div>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

  return (
    <Marker position={position} icon={busIcon} zIndexOffset={2000}>
      <Tooltip direction="top" offset={[0, -25]} opacity={1} className="bus-live-tooltip">
        <div style={{ textAlign: 'center', padding: '4px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>{busNumber}</div>
          {nextStop ? (
            <div style={{ marginTop: '4px' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Halte Selanjutnya</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: color }}>🏁 {nextStop.name}</div>
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Sedang beroperasi</div>
          )}
        </div>
      </Tooltip>
    </Marker>
  );
};

export default MovingBus;