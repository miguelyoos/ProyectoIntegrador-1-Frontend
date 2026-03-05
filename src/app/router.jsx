import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivitiesProvider } from "../context/ActivitiesContext";
import LoginPage from "../pages/LoginPage";
import Hoy from "../pages/Hoy";
import { DashboardPage, CalendarioPage } from '../pages/PlaceholderPages';
import ProtectedRoute from "../routes/ProtectedRoute";
import Layout from "../components/layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <ActivitiesProvider>  {/* ← movido aquí */}
                <Layout />
              </ActivitiesProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/hoy" element={<Hoy />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}