import React, { useState, useMemo } from "react";
import { findRoute, processRouteInstructions, extractPathGeometry } from "../utils/routing";

function RouteSearch({ corridors, onRouteFound, onRouteClear }) {
    const [originId, setOriginId] = useState("");
    const [destId, setDestId] = useState("");
    const [result, setResult] = useState(null);

    // Extract all unique stops
    const allStops = useMemo(() => {
        const stopsMap = new Map();
        corridors.forEach((c) => {
            c.stops.forEach((s) => {
                const uniqueId = `${s.name}-${s.lat}-${s.lng}`;
                if (!stopsMap.has(uniqueId)) {
                    stopsMap.set(uniqueId, { ...s, uniqueId });
                }
            });
        });
        return Array.from(stopsMap.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [corridors]);

    const handleSearch = () => {
        if (!originId || !destId) {
            alert("Silakan pilih halte asal dan tujuan terlebih dahulu.");
            return;
        }
        
        if (originId === destId) {
            alert("Halte asal dan tujuan tidak boleh sama.");
            return;
        }

        const origin = allStops.find((s) => s.uniqueId === originId);
        const destination = allStops.find((s) => s.uniqueId === destId);

        if (origin && destination) {
            const routeResult = findRoute(corridors, originId, destId);
            if (routeResult) {
                const instructions = processRouteInstructions(routeResult);
                const pathGeometry = extractPathGeometry(corridors, instructions);
                setResult({ origin, destination, distance: routeResult.totalDistance, instructions });
                if (onRouteFound) {
                    onRouteFound({
                        origin,
                        destination,
                        instructions,
                        totalDistance: routeResult.totalDistance,
                        pathGeometry
                    });
                }
            } else {
                alert("Tidak dapat menemukan rute antara kedua halte tersebut.");
            }
        }
    };

    const handleClear = () => {
        setOriginId("");
        setDestId("");
        setResult(null);
        if (onRouteClear) onRouteClear();
    };

    return (
        <div className="route-search-panel">
            <div className="rs-header">
                <div className="rs-title-row">
                    <svg viewBox="0 0 24 24" className="rs-plane-icon">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    <h2>Cari Rute</h2>
                    {result && (
                        <button className="rs-close-btn" onClick={handleClear}>
                            ✕
                        </button>
                    )}
                </div>
                <p className="rs-subtitle">
                    Pilih halte asal dan tujuan untuk melihat rute
                </p>
            </div>

            <div className="rs-form">
                <div className="rs-field">
                    <label>
                        <svg viewBox="0 0 24 24" className="rs-pin-icon green">
                            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Halte Asal
                    </label>
                    <select
                        value={originId}
                        onChange={(e) => setOriginId(e.target.value)}
                        className="rs-select"
                    >
                        <option value="">Pilih halte asal</option>
                        {allStops.map((stop) => (
                            <option key={`orig-${stop.uniqueId}`} value={stop.uniqueId}>
                                {stop.name} {stop.direction !== "N/A" ? `(Halte ${stop.direction})` : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="rs-field">
                    <label>
                        <svg viewBox="0 0 24 24" className="rs-pin-icon red">
                            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Halte Tujuan
                    </label>
                    <select
                        value={destId}
                        onChange={(e) => setDestId(e.target.value)}
                        className="rs-select"
                    >
                        <option value="">Pilih halte tujuan</option>
                        {allStops.map((stop) => (
                            <option key={`dest-${stop.uniqueId}`} value={stop.uniqueId}>
                                {stop.name} {stop.direction !== "N/A" ? `(Halte ${stop.direction})` : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="rs-submit-btn" onClick={handleSearch}>
                    <svg viewBox="0 0 24 24" className="rs-btn-icon">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    Cari Rute
                </button>
            </div>

            {result && (
                <div className="rs-result-card">
                    <div className="rs-result-row">
                        <div className="rs-result-icon">
                            <svg viewBox="0 0 24 24" className="rs-pin-icon green">
                                <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                        <div className="rs-result-info">
                            <span className="rs-result-label">Dari</span>
                            <span className="rs-result-value">{result.origin.name}</span>
                        </div>
                    </div>
                    <div className="rs-result-row">
                        <div className="rs-result-icon">
                            <svg viewBox="0 0 24 24" className="rs-pin-icon red">
                                <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                        <div className="rs-result-info">
                            <span className="rs-result-label">Ke</span>
                            <span className="rs-result-value">{result.destination.name}</span>
                        </div>
                    </div>

                    <div className="rs-instructions">
                        <div className="rs-inst-title">Langkah Perjalanan:</div>
                        {result.instructions.map((inst, idx) => (
                            <div key={idx} className={`rs-inst-step ${inst.type}`}>
                                {inst.type === 'ride' ? (
                                    <>
                                        <div className="rs-step-icon bg-blue">🚌</div>
                                        <div className="rs-step-text">
                                            Naik <strong>{inst.corridorName}</strong> dari {inst.fromStop.name} ke {inst.toStop.name} ({inst.distance.toFixed(1)} km)
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="rs-step-icon bg-yellow">🚶</div>
                                        <div className="rs-step-text">
                                            Transit di <strong>{inst.stop.name}</strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="rs-result-dist">
                        <span className="rs-dist-label">Total Jarak Tempuh</span>
                        <span className="rs-dist-value">{result.distance.toFixed(2)} km</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RouteSearch;
