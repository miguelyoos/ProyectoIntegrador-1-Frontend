import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
