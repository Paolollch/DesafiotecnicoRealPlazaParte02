Proyecto: Real Plaza - Caso 3 (Mantenimiento simple)

Resumen
- Frontend: React 18 (Vite) — formulario de login y mantenimiento de usuarios.
- Backend: .NET 8 API con JWT, EF Core y PostgreSQL.

Instrucciones rápidas para el evaluador
1) Preparar PostgreSQL en localhost:5432 (usuario `postgres` con tu contraseña).
2) Backend:
   - Abrir PowerShell en la carpeta `Backend`
   - Ejecutar:
     dotnet restore
     dotnet ef database update
     dotnet run --urls http://localhost:5001
   - El seed crea un usuario admin: usuario `admin`, contraseña `Admin123!` si no existe.
3) Frontend:
   - Abrir otra terminal en la carpeta `Frontend`
   - Ejecutar:
     npm install
     npm run dev
   - El frontend sirve en `http://localhost:3000` (o el puerto que Vite asigne).

Notas para el evaluador
- Si cambias la contraseña de `postgres`, actualiza `Backend/appsettings.json` > `ConnectionStrings:DefaultConnection`.
- Para pruebas API: `http://localhost:5001/swagger` (si está en Development).
