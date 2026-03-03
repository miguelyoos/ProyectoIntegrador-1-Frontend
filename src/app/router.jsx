import React, { useState } from 'react';
import { ActivitiesProvider } from '../context/ActivitiesContext';
import Header from '../components/layout/Header';
import NavBar from '../components/layout/NavBar';
import Hoy from '../pages/Hoy';
import LoginPage from '../pages/LoginPage';
import CrearActividad from '../pages/CrearActividad';
import ActividadDetalle from '../pages/ActividadDetalle';
import Progreso from '../pages/Progreso';
import { DashboardPage, CalendarioPage } from '../pages/PlaceholderPages';
import { BrowserRouter } from 'react-router-dom';

function AppContent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('actividades');

  if (!loggedIn) {
    return <LoginPage onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <>
      <Header userEmail="usuario@email.com" />
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'dashboard' && <DashboardPage/>}
      {activeTab === 'actividades' && <Hoy/>}
      {activeTab === 'calendario' && <CalendarioPage />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ActivitiesProvider>
        <AppContent />
      </ActivitiesProvider>
    </BrowserRouter>
  );
}
