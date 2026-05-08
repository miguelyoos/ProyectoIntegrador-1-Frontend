import React from 'react';
import './cargando.css';

export default function Cargando() {
  return (
    <div className="loading-container">
      <div className="skeleton-card">
        <div className="skeleton-bar"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta">
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-progress"></div>
        </div>
      </div>
      <div className="skeleton-card">
        <div className="skeleton-bar"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta">
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-progress"></div>
        </div>
      </div>
      <div className="skeleton-card">
        <div className="skeleton-bar"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta">
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-progress"></div>
        </div>
      </div>
    </div>
  );
}
