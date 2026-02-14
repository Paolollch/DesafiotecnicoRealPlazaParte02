Frontend - Real Plaza (React 18 + Vite)

Descripción:
- Interfaz en React 18 creada con Vite. Contiene página de login y mantenimiento de usuarios.

Levantar localmente:
1) Desde la carpeta `Frontend` ejecutar:
   npm install
   npm run dev

Configuración del endpoint API:
- Por defecto apunta a http://localhost:5001. Para cambiarlo, exporta `VITE_API_URL` antes de arrancar:
  (PowerShell)
  $env:VITE_API_URL = 'http://localhost:5001'
  npm run dev

Archivos relevantes:
- src/pages/Login.jsx, src/styles.css, src/api.js
