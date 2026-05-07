import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivitiesProvider } from "../context/ActivitiesContext";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Actividades from "../pages/actividades";
import { DashboardPage, CalendarioPage } from '../pages/PlaceholderPages';
import ProtectedRoute from "../routes/ProtectedRoute";
import Layout from "../components/layout/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>

      {/* TOAST AQUI */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <ActivitiesProvider>
                <Layout />
              </ActivitiesProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/hoy" element={<DashboardPage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}