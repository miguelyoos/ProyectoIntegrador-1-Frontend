import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivitiesProvider } from "../context/ActivitiesContext";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import actividades from "../pages/actividades";
import { DashboardPage, CalendarioPage } from '../pages/PlaceholderPages';
import ProtectedRoute from "../routes/ProtectedRoute";
import Layout from "../components/layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <ActivitiesProvider>  {/* ← movido aquí */}
                <Layout />
              </ActivitiesProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/actividades" element={<actividades />} />
          <Route path="/hoy" element={<DashboardPage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}