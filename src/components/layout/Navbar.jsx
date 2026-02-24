import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Desktop Layout */}
        <div className="desktop-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, color: '#000', fontWeight: '700', fontSize: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              TaskApp
            </h2>
            <div className="nav-links" style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/hoy" style={{ 
                textDecoration: 'none', 
                color: isActive('/hoy') ? '#fff' : '#6b7280', 
                fontWeight: '600',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                background: isActive('/hoy') ? '#000' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9375rem'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Hoy
              </Link>
              <Link to="/progreso" style={{ 
                textDecoration: 'none', 
                color: isActive('/progreso') ? '#fff' : '#6b7280', 
                fontWeight: '600',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                background: isActive('/progreso') ? '#000' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9375rem'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Progreso
              </Link>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="logout-btn"
            style={{ 
              background: '#000', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer', 
              fontSize: '0.875rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: grid !important;
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            gap: 1rem !important;
          }
          
          .desktop-nav > div:first-child {
            grid-column: 1;
            grid-row: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          
          .desktop-nav > div:first-child h2 {
            font-size: 1.25rem !important;
          }
          
          .logout-btn {
            grid-column: 2;
            grid-row: 1;
            align-self: start;
            padding: 0.5rem 1rem !important;
            font-size: 0.8125rem !important;
          }
          
          .nav-links {
            grid-column: 1 / -1;
            grid-row: 2;
            width: 100%;
            display: flex !important;
            gap: 0.75rem !important;
            justify-content: center;
          }
          
          .nav-links a {
            flex: 1;
            justify-content: center;
            padding: 1rem 1.5rem !important;
            font-size: 1rem !important;
            max-width: 200px;
          }
          
          .nav-links a svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          nav {
            padding: 0.75rem 1rem !important;
          }
          
          .desktop-nav > div:first-child h2 {
            font-size: 1.125rem !important;
          }
          
          .desktop-nav > div:first-child h2 svg {
            width: 20px;
            height: 20px;
          }
          
          .logout-btn {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.75rem !important;
          }
          
          .logout-btn svg {
            width: 16px !important;
            height: 16px !important;
          }
          
          .nav-links {
            gap: 0.5rem !important;
          }
          
          .nav-links a {
            padding: 0.875rem 1rem !important;
            font-size: 0.9375rem !important;
            max-width: none;
          }
          
          .nav-links a svg {
            width: 18px !important;
            height: 18px !important;
          }
        }
      `}</style>
    </nav>
  );
}
