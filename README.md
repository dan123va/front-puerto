# Liverpool Frontend

Interfaz de administración de usuarios y pedidos desarrollada con Next.js 16, React 19 y TypeScript.

## Requisitos

- Node.js 20.9 o posterior.
- npm.
- Liverpool API ejecutándose en `http://localhost:8080`.

Los pasos para iniciar la API están en `../liverpool-lapi/README.md`.

## Configurar el frontend

Desde esta carpeta crea el archivo local de variables de entorno:

```powershell
Copy-Item .env.example .env.local
```

El archivo `.env.local` debe contener:

```properties
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Si el backend utiliza otra dirección o puerto, actualiza esta variable.

## Instalar dependencias

```powershell
npm install
```

## Iniciar en desarrollo

```powershell
npm run dev
```

Abre la aplicación en:

```text
http://localhost:3000
```

## Comandos disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run lint`: valida el código con ESLint.
- `npm run build`: genera el build de producción.
- `npm run start`: inicia un build de producción existente.

Para comprobar el proyecto antes de desplegarlo:

```powershell
npm run lint
npm run build
```

Para ejecutar el build de producción:

```powershell
npm run build
npm run start
```

## Rutas de la aplicación

- `/`: listado, búsqueda y creación de pedidos.
- `/orders/[id]`: detalle, actualización de estado y eliminación de un pedido.

## Detener el frontend

Presiona `Ctrl + C` en la terminal donde se está ejecutando Next.js.

## Solución de problemas

- Si no aparecen pedidos, comprueba que `http://localhost:8080/api/orders` responda correctamente.
- Si cambia `.env.local`, reinicia `npm run dev`.
- Si el puerto `3000` está ocupado, detén el proceso que lo utiliza o inicia Next.js en otro puerto.
- Si aparece un error de CORS, comprueba que el backend permita `http://localhost:3000`.
