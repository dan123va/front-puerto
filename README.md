# Liverpool Pedidos — Next.js

Frontend de gestión de pedidos Next.js con App Router.

## Configuración

1. Copia `.env.example` como `.env.local`.
2. Ajusta `NEXT_PUBLIC_API_URL` si el backend no se ejecuta en `http://localhost:8080/api`.
3. Instala las dependencias con `npm install`.
4. Inicia el entorno local con `npm run dev`.

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de producción.
- `npm run start`: inicia el build de producción.
- `npm run lint`: validación de código.

## Rutas

- `/`: listado y búsqueda de pedidos.
- `/orders`: redirección al listado.
- `/orders/[id]`: detalle, actualización de estado y eliminación de un pedido.
