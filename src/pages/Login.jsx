import { useEffect, useState } from "react";
import { testConnection } from "../services/api";

export default function Login() {

  const [status, setStatus] = useState("Conectando con backend...");

  useEffect(() => {
    testConnection()
      .then(data => {
        setStatus(`✅ ${data.mensaje}`);
      })
      .catch(() => {
        setStatus("❌ Error conectando con backend");
      });
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          🚧 En Desarrollo
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Frontend en construcción
        </p>

        <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>
          {status}
        </p>
      </div>
    </div>
  );
}