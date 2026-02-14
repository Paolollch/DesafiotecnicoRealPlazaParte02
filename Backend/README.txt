Backend - Real Plaza (API .NET 8)

Descripción:
- API .NET 8 con EF Core (Npgsql) y autenticación JWT. Endpoints para autenticación y mantenimiento de usuarios.

Levantar localmente:
1) Asegúrate de PostgreSQL corriendo en localhost:5432.
2) Desde PowerShell en `Backend` ejecutar:
   dotnet restore
   dotnet ef database update
   dotnet run --urls http://localhost:5001

Credenciales seed (si no existe):
- Usuario: admin
- Password: Admin123!

Notas:
- Comprueba `appsettings.json` para la cadena `ConnectionStrings:DefaultConnection`.
- Mantén la carpeta `Migrations/` para versionar el esquema.
