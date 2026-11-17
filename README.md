# Salón Colaborativo — Front End

Front end de una aplicación web de un salón colaborativo, construida con React, TypeScript y Vite. Incluye pantallas públicas de bienvenida, registro y ayuda; vistas de dashboard y perfil; una vista de sala; y un diagnóstico de conexión con la API.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Ejecutar en desarrollo

Desde la carpeta raíz:

```bash
npm install
npm run dev (Para probar de manera local la visualizacion de la página)
```

(Crea un archivo `.env` local a partir de la plantilla)

```powershell
Copy-Item .env.example .env
```

En macOS/Linux:

```bash
cp .env.example .env
```

Completa en `.env` las variables (la configuración web de Firebase y `VITE_API_URL`).
`VITE_API_URL` es la dirección del backend **sin** `/api/v1` y sin barra final, por ejemplo `https://salon-coloborativo-back-3kd5.onrender.com`. En Vercel, después de crear o cambiar una variable `VITE_*`, hay que volver a desplegar. Luego inicia Vite:

```bash
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`). El servidor de desarrollo recarga la aplicación cuando guardas cambios.

## Comandos

```bash
npm run dev      # Servidor local de desarrollo
npm run build    # Verificación de TypeScript y build de producción
npm run preview  # Previsualiza localmente el build de producción
npm run lint     # Ejecuta ESLint
```

El build de producción se genera en `dist/`.

## Rutas principales

- `/` — bienvenida
- `/iniciar-sesion` — inicio de sesión
- `/registro` y `/registro/manual` — registro
- `/ayuda` y `/accesibilidad` — información y accesibilidad
- `/diagnostico-sistema` — estado de conexión con la API
- `/registro/nombre-de-usuario` — paso obligatorio tras registrarse con Google (o si falta el perfil)
- `/dashboard` y `/perfil` — vistas privadas (exigen sesión)
- `/salas/:id` — sala

## Acceso y sesión (Sprint 1)

- La sesión es de Firebase Auth (correo y Google); el perfil (nombre de usuario, avatar) vive en la API: `GET/POST /api/v1/users/me`.
- `AuthProvider` expone el estado con `useSesion()`: `cargando`, `sin-sesion`, `verificando`, `sin-perfil`, `listo` o `error`.
- `GuardiaSesion` decide a dónde va cada pantalla: sin sesión → `/iniciar-sesion`; sin perfil → `/registro/nombre-de-usuario`; con sesión, login y registro llevan al Panel.
- Componentes reutilizables en `src/components/ui`: `Button`, `LinkButton`, `TextField`, `Alert`, `Spinner`, `Avatar`, `AvatarPicker`, `GoogleButton`, `AuthCard`, `Separador`.
- En Firebase Console: habilita Correo/contraseña y Google en Authentication, y agrega tu dominio de Vercel en «Dominios autorizados».


## Prototipos de Stitch integrados

Pantallas incorporadas (escritorio y móvil, un mismo código responsivo con corte en `lg` = 1024 px):

| Pantalla | Ruta | Archivos principales |
| --- | --- | --- |
| Panel de salas (con salas, vacío, cargando, error) | `/dashboard` | `pages/Dashboard*.tsx`, `components/salas/*` |
| Perfil (ver, editar, éxito, eliminar cuenta, cargando) | `/perfil` | `pages/Perfil*.tsx`, `components/perfil/*` |
| Registro e inicio de sesión | `/registro`, `/iniciar-sesion` | `pages/RegistroPage.tsx`, `components/ui/AuthCard.tsx` |
| Marco privado (menú lateral, encabezado, barra inferior móvil) | — | `layouts/PrivateLayout.tsx`, `components/BarraLateral.tsx`, `NavInferior.tsx` |

Notas:

- Los selectores de estado de los prototipos (simuladores) **no** se incluyeron: los estados son reales. Solo en desarrollo
  puedes forzar el estado del Panel con `/dashboard?estado=vacio`, `?estado=error` o `?estado=cargando`.
- **Datos de demostración**: la API aún no tiene salas ni métricas. `lib/salas.ts` (almacén en memoria) y `lib/estadisticas.ts`
  devuelven datos de ejemplo mientras `VITE_DATOS_DEMO` no sea `false`. Cuando exista el backend, reemplaza esas funciones por `apiFetch`.
- **Contrato asumido con la API** (confirmar con backend): `PATCH /users/me` (editar nombre, usuario, bio y foto) y
  `DELETE /users/me` (eliminar cuenta; después se cierra la sesión).
- `/registro/manual` redirige a `/registro` (Google y correo ahora están en una sola pantalla).
- Avatares nuevos en `public/avatars` (calculo, codigo, ciencias, letras, ingenieria). Los anteriores se conservan para las cuentas existentes.
- Rutas nuevas `/mis-salas`, `/pizarra` y `/recursos` muestran «en construcción» (el menú del prototipo las incluye).
