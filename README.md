# Planificador de Estudio – Frontend

## Descripción

Aplicación web (SPA) construida con React que permite gestionar actividades evaluativas, visualizar prioridades en la vista "Hoy" y registrar progreso. Este frontend se conecta con una API REST (Django REST Framework) mediante peticiones HTTP.

## Arquitectura

- **React (Vite)** - Framework principal
- **React Router** - Navegación SPA
- **React DatePicker** - Selector de fechas profesional
- **LocalStorage** - Persistencia temporal de datos
- **Backend separado** - Django REST Framework
- **Despliegue previsto** - Vercel

## Estructura del proyecto

```
src/
  app/
    router.jsx
  pages/
    Login.jsx
    Hoy.jsx
    CrearActividad.jsx
    ActividadDetalle.jsx
    Progreso.jsx
  components/
    layout/
      Navbar.jsx
      Layout.jsx
    hoy/
      GrupoTareas.jsx
      TareaItem.jsx
    ui/
      Button.jsx
      Input.jsx
      EmptyState.jsx
  services/
    api.js
  styles/
    global.css
```

## Rutas disponibles

- `/login` → Autenticación de usuario (simulada)
- `/hoy` → Vista de actividades del día actual
- `/crear` → Formulario para crear nueva actividad
- `/actividad/:id` → Detalle y edición de actividad
- `/progreso` → Estadísticas y progreso general

## Instalación y ejecución

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para ejecutar el proyecto

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ProyectoIntegrador-1-Frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear archivo de configuración**
   
   Crear un archivo `.env` en la raíz del proyecto con:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   
   La aplicación estará disponible en `http://localhost:5173`

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera build de producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## Comunicación con backend

El frontend consume la API mediante funciones configuradas en `services/api.js`. Actualmente utiliza LocalStorage para simular la persistencia de datos.

### Endpoints previstos

- `GET /api/actividades/hoy` - Obtener actividades del día
- `POST /api/actividades` - Crear nueva actividad
- `GET /api/actividades/:id` - Obtener detalle de actividad
- `PUT /api/actividades/:id` - Actualizar actividad
- `DELETE /api/actividades/:id` - Eliminar actividad
- `GET /api/estadisticas` - Obtener estadísticas de progreso

## Estado actual – Sprint 0

- ✅ Base técnica configurada (React + Vite)
- ✅ SPA con rutas mínimas implementadas
- ✅ Vista `/hoy` funcional con gestión de tareas
- ✅ Vista `/progreso` con estadísticas
- ✅ Formulario de creación de actividades con calendario
- ✅ Login simulado (sin autenticación real)
- ✅ Diseño responsive con esquema blanco y negro
- ✅ Navegación con iconos profesionales
- ⏳ Conexión con backend real (pendiente)

## Consideraciones de accesibilidad

- Labels asociados a todos los inputs
- Foco visible en elementos interactivos
- Navegación por teclado funcional
- Estados claros (vacío, cargando, error, éxito)
- Contraste adecuado en textos y botones
- Iconos con significado visual claro
- Responsive design para diferentes dispositivos

## Características principales

### Diseño
- Esquema de colores minimalista (blanco y negro)
- Interfaz limpia y profesional
- Totalmente responsive (desktop, tablet, móvil)
- Iconos SVG para mejor rendimiento

### Funcionalidades
- Gestión completa de actividades (CRUD)
- Visualización de tareas por día
- Marcado de tareas completadas/pendientes
- Estadísticas de progreso
- Calendario profesional para selección de fechas
- Persistencia local de datos

### Experiencia de usuario
- Navegación intuitiva
- Feedback visual en interacciones
- Estados de carga y vacío
- Confirmaciones para acciones destructivas
- Transiciones suaves

## Tecnologías utilizadas

- React 18
- Vite
- React Router DOM
- React DatePicker
- CSS-in-JS (inline styles)

## Próximos pasos

1. Integrar con backend Django REST Framework
2. Implementar autenticación real con JWT
3. Agregar manejo de errores robusto
4. Implementar tests unitarios
5. Optimizar rendimiento
6. Agregar más filtros y vistas
7. Implementar notificaciones

## Perfiles de usuario

### Perfil 1 – Alejandra
**Contexto:** Una estudiante estudia en horario diurno de lunes a viernes y trabaja de manera nocturna, ocupa espacios en la tarde y en la noche para estudiar.

**Objetivo:** Organizar maneras más eficientes para dividir su tiempo y que logre completar las tareas y deberes de la universidad.

**Frustración:** No logra encontrar un equilibrio entre su trabajo y sus deberes de la universidad.

**Riesgo:** Pueden haber deberes que no sean cumplidos o tareas que no sean entregadas.

**Modelo mental:** Realiza tareas de vez en cuando, pero muchas las deja a la mitad debido a su falta de organización entre su trabajo y su estudio.

### Perfil 2
**Contexto:** Un estudiante que trabaja en horario diurno de lunes a viernes y estudia de manera nocturna, ocupa espacios en la mañana y fines de semana para estudiar.

**Objetivo:** Organizar de maneras más eficientes su tiempo dedicado a tareas y estudios.

**Frustración:** Poco tiempo y poca organización y olvida tareas pendientes.

**Riesgo:** Llega a tener tareas sin entregar.

**Modelo mental:** Realiza tareas según se las van dejando y si no la deja pasar y la olvida.

## Contribución

Este proyecto es parte del Miniproyecto I - Planificador de Estudio.
