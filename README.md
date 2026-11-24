# Gestor de tareas por materias

Aplicación web para organizar tareas académicas por materia. Permite crear materias y tareas, asignarlas, marcarlas como completadas, buscar tareas y personalizar el fondo de la interfaz. Los datos se almacenan en PostgreSQL.

![Curva S del proyecto](curva_s_variable_gestor_tareas.png)

## Requisitos

- Node.js 20 o superior y npm.
- PostgreSQL 12 o superior, o una instancia compatible como Supabase.

## Instalación y configuración

1. Cloná el repositorio y entrá en la carpeta del proyecto.
2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Creá un archivo `.env` a partir de `.env.example` y configurá tus propios datos de conexión:

   ```env
   DATABASE_URL=postgresql://usuario:clave@host:5432/base
   DATABASE_SSL=false
   PORT=3000
   ```

   Para conexiones que requieran SSL, configurá `DATABASE_SSL=true`. No publiques credenciales reales ni subas `.env` al repositorio.

4. Prepará la base de datos. Con PostgreSQL local, ejecutá desde `database/`:

   ```bash
   psql -U postgres -f setup.sql
   ```

   `setup.sql` crea la base `gestor_tareas` si no existe y ejecuta `estructura.sql`. Si usás una base gestionada, ejecutá `database/estructura.sql` en esa base directamente.

## Ejecución

- Desarrollo con reinicio automático: `npm run dev`
- Ejecución normal: `npm start`

Abrí [http://localhost:3000](http://localhost:3000). El servidor verifica la conexión a PostgreSQL al iniciar. El endpoint `GET /api/health` informa el estado de la API y la base de datos.

## Funcionalidades

- Crear y eliminar materias.
- Crear, listar, editar, completar y eliminar tareas.
- Asignar tareas a una materia o dejarlas sin asignar.
- Buscar tareas y filtrar la lista por materia.
- Personalizar el fondo con colores, degradados o una imagen.
- Validar datos y evitar nombres de materias y tareas duplicados según las restricciones de la base.

## API

Las respuestas usan JSON. Para enviar datos, usá `Content-Type: application/json`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Comprueba la conexión con la base de datos. |
| `GET` | `/api/materias` | Lista las materias. |
| `POST` | `/api/materias` | Crea una materia con `{ "nombre": "Historia" }`. |
| `DELETE` | `/api/materias/:id` | Elimina una materia; sus tareas quedan sin asignar. |
| `GET` | `/api/tareas` | Lista las tareas. |
| `POST` | `/api/tareas` | Crea una tarea con `{ "texto": "Leer capítulo", "materiaId": 1001 }`. `materiaId` puede ser `null` u omitirse. |
| `PATCH` | `/api/tareas/:id` | Actualiza uno o más campos: `texto`, `completada` o `materiaId`. |
| `DELETE` | `/api/tareas/:id` | Elimina una tarea. |

Los nombres de materia deben tener entre 2 y 80 caracteres. El texto de una tarea debe tener entre 3 y 255 caracteres. Las respuestas de error incluyen un mensaje; las validaciones pueden incluir el detalle de los campos inválidos.

## Base de datos

El esquema está en `database/estructura.sql`. Define las tablas `materias` y `tareas`, sus claves y restricciones, e inserta materias iniciales. Al borrar una materia, las tareas asociadas se conservan con `materia_id` en `NULL`.

## Pruebas y comprobaciones

- `npm test`: ejecuta pruebas unitarias y de integración; estas últimas usan una base PostgreSQL en memoria (`pg-mem`).
- `npm run check`: comprueba la sintaxis de los puntos de entrada del backend y del frontend.

## Estructura del proyecto

```text
backend/
  config/       conexión a PostgreSQL
  controllers/  controladores HTTP
  models/       consultas SQL
  routes/       rutas de la API
  services/     lógica y validaciones
  app.js        configuración de Express
  server.js     inicio del servidor
frontend/       interfaz HTML, CSS y JavaScript
 database/      creación del esquema y datos iniciales
tests/          pruebas unitarias y de integración
```

## About WBS

La WBS (Work Breakdown Structure o estructura de desglose del trabajo) organiza el alcance del proyecto en entregables y paquetes de trabajo:

1. **Gestión y planificación**: alcance, cronograma, seguimiento y curva S.
2. **Diseño de datos**: modelo de materias y tareas, relaciones, restricciones e inicialización de PostgreSQL.
3. **Backend y API**: configuración del servidor, conexión a la base, rutas, controladores, lógica de negocio y validaciones.
4. **Frontend**: interfaz adaptable, gestión de materias y tareas, búsqueda, filtros y personalización visual.
5. **Calidad**: pruebas unitarias, pruebas de integración y comprobación sintáctica.
6. **Documentación y entrega**: instrucciones de instalación, configuración, uso y descripción de la estructura del sistema.

![Curva S del proyecto](curva_s_variable_gestor_tareas.png)
