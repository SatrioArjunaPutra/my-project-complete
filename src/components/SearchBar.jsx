import { useState, useRef, useEffect, useMemo } from "react";
import { translations } from "../utils/translations";

function SearchBar({ corridors, onSelectStop, lang = 'id' }) {
    const t = translations[lang];
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [filterDirection, setFilterDirection] = useState("all"); // all, A, B
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const containerRef = useRef(null);

    // Build a flat list of all stops with corridor info
    const allStops = useMemo(() => {
        const stops = [];
        corridors.forEach((corridor) => {
            corridor.stops.forEach((stop) => {
                stops.push({
                    ...stop,
                    corridorId: corridor.id,
                    corridorName: corridor.name,
                    corridorColor: corridor.color,
                    corridorRoute: corridor.route,
                    operatingHours: corridor.operatingHours,
                });
            });
        });
        return stops;
    }, [corridors]);

    // Filter stops based on query and direction
    const filteredStops = useMemo(() => {
        let results = allStops;

        // Filter by direction
        if (filterDirection !== "all") {
            results = results.filter((s) => s.direction === filterDirection);
        }

        // Filter by search query
        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(
                (stop) =>
                    stop.name.toLowerCase().includes(lowerQuery) ||
                    stop.fullName.toLowerCase().includes(lowerQuery) ||
                    stop.corridorName.toLowerCase().includes(lowerQuery) ||
                    stop.corridorRoute.toLowerCase().includes(lowerQuery)
            );
        }

        return results;
    }, [query, allStops, filterDirection]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setHighlightIndex(-1);
    }, [filteredStops]);

    const handleSelect = (stop) => {
        onSelectStop(stop);
        setQuery(stop.fullName);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev < filteredStops.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev > 0 ? prev - 1 : filteredStops.length - 1
            );
        } else if (e.key === "Enter" && highlightIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredStops[highlightIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    useEffect(() => {
        if (highlightIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll(".search-result-item");
            if (items[highlightIndex]) {
                items[highlightIndex].scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightIndex]);

    return (
        <div className="search-container" ref={containerRef}>
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder={lang === 'id' ? 'Cari halte atau terminal...' : 'Search for stops or terminals...'}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <button
                        className="search-clear"
                        onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                            inputRef.current?.focus();
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="search-results" ref={listRef}>
                    {/* Direction filter tabs */}
                    <div className="search-filter-tabs">
                        <button
                            className={`filter-tab ${filterDirection === "all" ? "active" : ""}`}
                            onClick={() => setFilterDirection("all")}
                        >
                            {lang === 'id' ? 'Semua' : 'All'}
                        </button>
                        <button
                            className={`filter-tab tab-a ${filterDirection === "A" ? "active" : ""}`}
                            onClick={() => setFilterDirection("A")}
                        >
                            {lang === 'id' ? 'Halte A' : 'Stop A'}
                        </button>
                        <button
                            className={`filter-tab tab-b ${filterDirection === "B" ? "active" : ""}`}
                            onClick={() => setFilterDirection("B")}
                        >
                            {lang === 'id' ? 'Halte B' : 'Stop B'}
                        </button>
                    </div>

                    {filteredStops.length === 0 ? (
                        <div className="search-no-results">
                            <span>😕</span> {lang === 'id' ? 'Halte tidak ditemukan' : 'Stop not found'}
                        </div>
                    ) : (
                        <>
                            <div className="search-results-count">
                                {filteredStops.length} {lang === 'id' ? 'titik halte ditemukan' : 'bus stops found'}
                            </div>
                            <div className="search-results-list">
                                {filteredStops.slice(0, 50).map((stop, index) => (
                                    <div
                                        key={`${stop.corridorId}-${stop.fullName}-${index}`}
                                        className={`search-result-item ${index === highlightIndex ? "highlighted" : ""
                                            }`}
                                        onClick={() => handleSelect(stop)}
                                        onMouseEnter={() => setHighlightIndex(index)}
                                    >
                                        <div className="search-result-icon">
                                            {stop.type === "terminal" ? "🚏" : "🚌"}
                                        </div>
                                        <div className="search-result-info">
                                            <div className="search-result-name">
                                                {stop.name}
                                                <span
                                                    className={`search-dir-badge dir-${stop.direction}`}
                                                >
                                                    {stop.direction}
                                                </span>
                                            </div>
                                            <div className="search-result-info-meta">
                                                <span
                                                    className="search-corridor-tag"
                                                    style={{ background: stop.corridorColor }}
                                                >
                                                    {stop.corridorName}
                                                </span>
                                                <span className="search-result-route">
                                                    {stop.corridorRoute}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="search-result-type">
                                            {stop.type === "terminal" ? (lang === 'id' ? 'Terminal' : 'Terminal') : (lang === 'id' ? 'Halte' : 'Bus Stop')}
                                        </div>
                                    </div>
                                ))}
                                {filteredStops.length > 50 && (
                                    <div className="search-more">
                                        +{filteredStops.length - 50} {lang === 'id' ? 'halte lainnya...' : 'other stops...'}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;