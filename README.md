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
## Curva S – Seguimiento del proyecto

La curva S representa la evolución acumulada de las horas dedicadas al desarrollo del proyecto desde el 11 de mayo hasta el 23 de noviembre de 2026.

Se propone una distribución variable del esfuerzo:
- **Inicio:** menor dedicación, enfocada en organización, análisis y planificación.
- **Desarrollo:** aumento progresivo de las horas destinadas a programación del frontend y backend.
- **Integración y pruebas:** mayor dedicación para integrar funcionalidades, detectar errores y realizar correcciones.
- **Cierre:** reducción de las horas destinadas a ajustes finales y documentación.

### Registro semanal estimado

| Fecha | Horas semanales | Horas acumuladas |
|---|---:|---:|
| 11/05/2026 | 2 | 2 |
| 18/05/2026 | 2 | 4 |
| 25/05/2026 | 2 | 6 |
| 01/06/2026 | 3 | 9 |
| 08/06/2026 | 3 | 12 |
| 15/06/2026 | 3 | 15 |
| 22/06/2026 | 4 | 19 |
| 29/06/2026 | 4 | 23 |
| 06/07/2026 | 4 | 27 |
| 13/07/2026 | 4 | 31 |
| 20/07/2026 | 4 | 35 |
| 27/07/2026 | 4 | 39 |
| 03/08/2026 | 5 | 44 |
| 10/08/2026 | 5 | 49 |
| 17/08/2026 | 5 | 54 |
| 24/08/2026 | 5 | 59 |
| 31/08/2026 | 5 | 64 |
| 07/09/2026 | 5 | 69 |
| 14/09/2026 | 5 | 74 |
| 21/09/2026 | 5 | 79 |
| 28/09/2026 | 5 | 84 |
| 05/10/2026 | 5 | 89 |
| 12/10/2026 | 5 | 94 |
| 19/10/2026 | 5 | 99 |
| 26/10/2026 | 4 | 103 |
| 02/11/2026 | 4 | 107 |
| 09/11/2026 | 4 | 111 |
| 16/11/2026 | 3 | 114 |
| 23/11/2026 | 2 | 116 |

### Resumen de horas por etapa

| Etapa | Horas estimadas |
|---|---:|
| Inicio y planificación | 15 |
| Diseño y preparación | 24 |
| Desarrollo e implementación | 60 |
| Integración y pruebas | 12 |
| Cierre y documentación | 5 |
| **Total** | **116 horas** |

**Resultado:** se estima una dedicación acumulada de 116 horas durante el período considerado.

> Nota: esta curva es una estimación variable que conserva las 116 horas totales. Si se registraron exactamente 4 horas todos los lunes, la curva correspondiente debe ser lineal y no esta distribución.

---

## WBS – Estructura de Desglose del Trabajo

El WBS (Work Breakdown Structure) permite dividir el proyecto en etapas, actividades y entregables para facilitar su planificación, organización y seguimiento.

### 1. Gestión y organización del proyecto
- 1.1 Organización del equipo.
- 1.2 Distribución de responsabilidades.
- 1.3 Coordinación y seguimiento de actividades.
- 1.4 Control del avance del proyecto.

**Entregable:** planificación y organización del equipo.

### 2. Análisis y definición de requisitos
- 2.1 Identificación del problema.
- 2.2 Definición de objetivos.
- 2.3 Identificación de usuarios y necesidades.
- 2.4 Definición de funcionalidades.
- 2.5 Establecimiento del alcance.

**Entregable:** requisitos funcionales y alcance del sistema.

### 3. Diseño del sistema
- 3.1 Diseño de la arquitectura cliente-servidor.
- 3.2 Diseño de la estructura del frontend.
- 3.3 Diseño de la API.
- 3.4 Diseño de la base de datos.
- 3.5 Definición de relaciones entre tareas y materias.

**Entregable:** diseño técnico y modelo de datos.

### 4. Desarrollo del backend
- 4.1 Configuración de Node.js y Express.
- 4.2 Configuración de PostgreSQL.
- 4.3 Implementación de modelos.
- 4.4 Implementación de servicios.
- 4.5 Implementación de controladores.
- 4.6 Implementación de rutas.
- 4.7 Desarrollo de validaciones.
- 4.8 Implementación de operaciones CRUD para tareas.
- 4.9 Implementación de operaciones CRUD para materias.

**Entregable:** API funcional conectada a la base de datos.

### 5. Desarrollo del frontend
- 5.1 Estructuración de HTML.
- 5.2 Diseño visual mediante CSS.
- 5.3 Implementación de funcionalidades con JavaScript.
- 5.4 Creación de tareas.
- 5.5 Edición y eliminación de tareas.
- 5.6 Marcado de tareas como completadas.
- 5.7 Administración de materias.
- 5.8 Implementación de búsqueda.
- 5.9 Personalización visual.
- 5.10 Adaptación responsive.

**Entregable:** interfaz web funcional.

### 6. Integración del sistema
- 6.1 Conexión entre frontend y backend.
- 6.2 Integración con PostgreSQL.
- 6.3 Verificación de solicitudes HTTP.
- 6.4 Manejo de respuestas y errores.
- 6.5 Migración de datos anteriores desde localStorage.

**Entregable:** aplicación integrada.

### 7. Pruebas y control de calidad
- 7.1 Pruebas unitarias.
- 7.2 Pruebas de integración.
- 7.3 Verificación de validaciones.
- 7.4 Pruebas de endpoints.
- 7.5 Detección y corrección de errores.
- 7.6 Verificación del funcionamiento general.

**Entregable:** sistema probado y corregido.

### 8. Documentación y entrega
- 8.1 Elaboración del README.
- 8.2 Documentación técnica.
- 8.3 Elaboración del WBS.
- 8.4 Elaboración de la curva S.
- 8.5 Organización de archivos del repositorio.
- 8.6 Preparación de la entrega final.

**Entregable:** documentación y proyecto final.

### Resumen del WBS

| Código | Paquete de trabajo | Resultado |
|---|---|---|
| 1 | Gestión y organización | Equipo organizado |
| 2 | Análisis y requisitos | Requisitos definidos |
| 3 | Diseño | Arquitectura y modelo de datos |
| 4 | Backend | API y base de datos |
| 5 | Frontend | Interfaz web |
| 6 | Integración | Sistema conectado |
| 7 | Pruebas | Sistema verificado |
| 8 | Documentación y entrega | Proyecto documentado |

## Conclusión del seguimiento

La planificación contempla las etapas principales del desarrollo del Gestor de Tareas por Materias, desde la organización inicial hasta la documentación y entrega final.

El WBS permite visualizar y organizar el trabajo, mientras que la curva S permite representar la evolución acumulada del esfuerzo durante el proyecto.



