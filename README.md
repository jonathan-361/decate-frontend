# Dacate

Este proyecto fue desarrollado con:

- Vite
- React
- Typescript

---

## Contenido

El proyecto se divide en siete módulos siendo:

### Tareas y actividades

Administración de trabajos y pendientes escolares.

- Listado de tareas.
- Crear, editar y eliminar tareas.
- Materia relacionada.
- Fecha y hora de entrega.
- Prioridad.
- Estado: pendiente, en proceso y completada.
- Descripción y archivos adjuntos.

### Calendario académico

Visualización de todas las actividades en un calendario.

- Vista mensual, semanal y diaria.
- Mostrar tareas y exámenes.
- Mostrar eventos importantes.
- Seleccionar un día para consultar sus actividades.
- Identificar fechas de entrega próximas.

### Horario de clases

Administración de las clases del estudiante.

- Registrar materias.
- Profesor.
- Aula o ubicación.
- Días de clase.
- Hora de inicio y finalización.
- Color identificador por materia.
- Consultar horario semanal.

### Exámenes

Un apartado especializado para evaluaciones.

- Nombre del examen.
- Materia.
- Fecha y hora.
- Lugar.
- Temas que se evaluarán.
- Tiempo restante para el examen.
- Recordatorios para estudiar.

### Recordatorios y notificaciones

Control de avisos de actividades académicas.

- Notificaciones de tareas próximas.
- Avisos de exámenes.
- Recordatorios de clases.
- Configuración de anticipación.
- Historial de notificaciones.
- Activar o desactivar recordatorios.

---

## Instalación

El primer paso es instalar las dependencias con

```
pnpm install
```

Luego es necesario ejecutarlo con

```
pnpm run dev
```

Por ahora contiene principalmente el diseño puro con placeholders al estar en desarrollo.

---

### Endpoints

#### Autenticación

- **/login:** Iniciar sesión
- **/register:** Registrar un usuario
- **/forgotPassword:** Cambiar contraseña (obtener código)
- **/changePassword:** Cambiar la contraseña

#### Módulos principales

- **/home:** Dashboard principal
- **/tasks:** Apartado de tareas
- **/calendar:** Apartado de calendario
- **/schedules:** Horarios de clase
- **/exams:** Examenes
- **/reminders:** Recordatorios

#### Usuario

- **/profile:** Perfil del usuario
- **/settings:** Ajustes de perfil
