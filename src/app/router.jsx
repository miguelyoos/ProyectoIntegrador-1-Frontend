import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Login from '../pages/Login';
import Hoy from '../pages/Hoy';
import CrearActividad from '../pages/CrearActividad';
import ActividadDetalle from '../pages/ActividadDetalle';
import Progreso from '../pages/Progreso';

export default function Router() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/hoy" />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/hoy" />} />
          <Route path="hoy" element={<Hoy />} />
          <Route path="crear" element={<CrearActividad />} />
          <Route path="actividad/:id" element={<ActividadDetalle />} />
          <Route path="progreso" element={<Progreso />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
