# MDPRIME Panel

Panel privado de gestión de clientes y referidos, desplegado en Render y conectado a MySQL/Railway.

## Variables requeridas en Render

Configura estas variables en **Environment** antes de desplegar esta versión:

| Variable | Uso |
|---|---|
| `APP_DEBUG` | Debe permanecer en `false` en producción |
| `PANEL_PASSWORD` | Contraseña nueva de acceso al panel |
| `DB_HOST` | Host de Railway |
| `DB_PORT` | Puerto MySQL de Railway |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario MySQL |
| `DB_PASS` | Contraseña de Railway (también admite `DB_PASSWORD`) |
| `SIGMA_API_URL` | URL autorizada de la API de clientes |
| `SIGMA_API_TOKEN` | Token opcional; también puede gestionarse desde el panel |

No guardes secretos en GitHub ni en archivos `.env` versionados.

## Despliegue

Render construye la aplicación usando el `Dockerfile`. El contenedor instala PDO MySQL y cURL y sirve la aplicación en el puerto `10000`.

## Cambios de la renovación Apple

- Nueva interfaz clara, responsive y con jerarquía visual inspirada en Apple.
- Estilos separados en `assets/apple.css`.
- Credenciales trasladadas a variables privadas.
- Cookies de sesión reforzadas y regeneración del identificador al entrar.
- Protección CSRF para operaciones del panel.
- Bloqueo temporal tras varios intentos fallidos.
- Mensajes de base de datos sin detalles internos.
- Endpoint de depuración disponible únicamente con `APP_DEBUG=true`.
- Extensión cURL incluida en la imagen para el importador Sigma.
