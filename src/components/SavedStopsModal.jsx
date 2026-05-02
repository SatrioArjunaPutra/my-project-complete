import React from 'react';
import './SavedStopsModal.css';

function SavedStopsModal({ isOpen, onClose, savedStops, onRemove, onSelect, lang = 'id' }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="saved-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="saved-modal-header">
                    <div className="saved-header-left">
                        <div className="saved-header-icon">🎒</div>
                        <div className="saved-header-titles">
                            <h2>{lang === 'id' ? 'Rencana Perjalanan' : 'Travel Plans'}</h2>
                            <p>{lang === 'id' ? `Pribadi • ${savedStops.length} tempat` : `Private • ${savedStops.length} places`}</p>
                        </div>
                    </div>
                    <button className="saved-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="saved-modal-body">
                    {savedStops.length === 0 ? (
                        <div className="saved-empty">
                            <div className="empty-icon">📍</div>
                            <p>{lang === 'id' ? 'Belum ada tempat yang disimpan' : 'No places saved yet'}</p>
                            <span>{lang === 'id' ? 'Simpan halte favorit Anda untuk merencanakan perjalanan' : 'Save your favorite stops to plan your journey'}</span>
                        </div>
                    ) : (
                        <div className="saved-list">
                            {savedStops.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)).map((stop) => (
                                <div key={stop.uniqueId} className="saved-item" onClick={() => { onSelect(stop); onClose(); }}>
                                    <div className="saved-item-icon">🚏</div>
                                    <div className="saved-item-info">
                                        <h3>{stop.name}</h3>
                                        <p>{stop.fullName}</p>
                                        <div className="saved-item-meta">
                                            <span className="saved-tag">{stop.direction === 'A' ? 'Arah A' : 'Arah B'}</span>
                                            <span className="saved-time">{new Date(stop.savedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className="saved-item-remove" 
                                        onClick={(e) => { e.stopPropagation(); onRemove(stop.uniqueId); }}
                                        title={lang === 'id' ? 'Hapus' : 'Remove'}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="saved-modal-footer">
                    <button className="saved-done-btn" onClick={onClose}>
                        {lang === 'id' ? 'Selesai' : 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SavedStopsModal;
