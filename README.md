 Gestor de Tareas por Materias

 Descripción del proyecto

El Gestor de Tareas por Materias es una aplicación web desarrollada para facilitar la organización y el seguimiento de actividades académicas. Permite administrar tareas, clasificarlas por materia, modificar su estado y mantener un control de las actividades pendientes y completadas.

El objetivo principal es brindar una herramienta sencilla e intuitiva que ayude a los estudiantes a organizar sus responsabilidades académicas.

 Objetivos

- Organizar tareas según las materias.
- Crear, editar y eliminar tareas.
- Marcar tareas como completadas.
- Buscar tareas de manera sencilla.
- Administrar las materias disponibles.
- Facilitar el seguimiento de las actividades pendientes.

 Tecnologías utilizadas

 Frontend
- HTML5
- CSS3
- JavaScript

Backend
- Node.js
- Express.js

Base de datos
- PostgreSQL

Pruebas
- Tests unitarios.
- Tests de integración.

 Funcionalidades principales

- **Gestión de tareas:** permite agregar, editar, eliminar y completar tareas.
- **Gestión de materias:** permite crear y eliminar materias.
- **Clasificación:** permite asociar tareas a materias.
- **Búsqueda:** facilita encontrar tareas.
- **Personalización:** permite modificar el fondo de la aplicación.
- **Diseño responsive:** cuenta con una interfaz adaptable a distintos dispositivos.
- **Persistencia de datos:** utiliza PostgreSQL para almacenar la información.
- **Migración de datos:** contempla la recuperación de información anterior almacenada en localStorage.

 Arquitectura del proyecto

El sistema utiliza una arquitectura cliente-servidor.

- **Frontend:** contiene la interfaz gráfica y la interacción con el usuario.
- **Backend:** procesa las solicitudes y aplica las reglas de negocio.
- **Base de datos:** almacena las tareas y materias.

El backend está organizado en diferentes capas:

- Rutas.
- Controladores.
- Servicios.
- Modelos.
- Validaciones.
- Configuración de base de datos.

## Endpoints principales de la API

### Salud del servidor
- `GET /api/health`: verifica el estado del servidor.

### Tareas
- `GET /api/tareas`: obtiene las tareas.
- `POST /api/tareas`: crea una tarea.
- `PATCH /api/tareas/:id`: modifica una tarea.
- `DELETE /api/tareas/:id`: elimina una tarea.

### Materias
- `GET /api/materias`: obtiene las materias.
- `POST /api/materias`: crea una materia.
- `DELETE /api/materias/:id`: elimina una materia.

## Modelo de datos

La base de datos utiliza dos tablas principales:

### Materias
Almacena las materias creadas por el usuario.

### Tareas
Almacena las tareas y su información, incluyendo:
- Identificador.
- Descripción.
- Estado de finalización.
- Materia asociada.

La relación entre tareas y materias permite clasificar las actividades académicas. Si se elimina una materia, las tareas asociadas conservan su registro y quedan sin materia asignada.

## Validaciones

El sistema incorpora validaciones para mantener la integridad de los datos:

- Las tareas deben tener entre 3 y 255 caracteres.
- Las materias deben tener entre 2 y 80 caracteres.
- El estado de una tarea debe ser booleano.
- La materia asociada debe ser válida o nula.

## Estructura del proyecto

```text
tp-grupo3-2026/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── app.js
├── frontend/
├── tests/
│   ├── unit/
│   └── integration/
├── README.md
```

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone https://github.com/Grupo-3-GESTOR-DE-TAREAS/tp-grupo3-2026.git
```

2. Ingresar a la carpeta del proyecto:

```bash
cd tp-grupo3-2026
```

3. Instalar las dependencias del backend:

```bash
cd backend
npm install
```

4. Configurar las variables de entorno necesarias para la conexión con PostgreSQL, tomando como referencia el archivo `.env.example`.

5. Crear y configurar la base de datos utilizando el script SQL disponible en el proyecto.

6. Ejecutar el servidor utilizando el comando definido en `package.json`.

**Nota:** los comandos exactos de inicio pueden variar según los scripts configurados en el proyecto.

## Pruebas

El proyecto cuenta con pruebas unitarias y de integración:

- `tests/unit/taskValidation.test.js`
- `tests/integration/api.test.js`

Estas pruebas permiten verificar las validaciones y el funcionamiento de los endpoints principales.

## Documentación del proyecto

La documentación complementaria incluye:

- Descripción general del sistema.
- Objetivos y alcance.
- Arquitectura.
- Funcionalidades.
- Estructura de trabajo (WBS).
- Curva S de avance del proyecto.
- Estimación de horas de trabajo.

## Organización del trabajo (WBS)

El trabajo se organizó en las siguientes etapas:

1. **Organización y gestión:** coordinación del equipo y distribución de responsabilidades.
2. **Análisis y definición:** identificación de necesidades y requisitos.
3. **Planificación:** definición de tareas, tiempos y entregables.
4. **Diseño:** diseño de la arquitectura y estructura de datos.
5. **Desarrollo backend:** implementación de API, lógica de negocio y conexión con PostgreSQL.
6. **Desarrollo frontend:** implementación de interfaz y funcionalidades.
7. **Pruebas e integración:** verificación del funcionamiento y corrección de errores.
8. **Documentación y entrega:** elaboración de documentación y preparación del proyecto final.

## Curva S y estimación de horas

Para el seguimiento del proyecto se tomó como fecha de inicio el **11 de mayo de 2026**.

Se estableció una dedicación estimada de **4 horas todos los lunes**, hasta el 23 de noviembre de 2026.

- Cantidad de lunes considerados: 29.
- Dedicación semanal estimada: 4 horas.
- Total estimado: 116 horas.

La curva S permite representar la evolución acumulada del esfuerzo a lo largo del proyecto. La distribución del trabajo contempla las etapas de planificación, desarrollo, integración, pruebas y documentación.

**Importante:** las horas representan una estimación basada en la planificación semanal y no un registro horario real de cada integrante.

## Equipo de desarrollo

Proyecto académico realizado por el **Grupo 3**.

## Estado del proyecto

Proyecto académico de desarrollo de una aplicación web para la gestión y organización de tareas por materias.
