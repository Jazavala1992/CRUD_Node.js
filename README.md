# Práctica 3 - Aplicación Web con Node.js y MySQL

Aplicación web desarrollada con Node.js, Express y MySQL para la gestión de pacientes.

## Tecnologías utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos
- **EJS** - Motor de plantillas
- **Morgan** - Logger de peticiones HTTP

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd "Practica 3"
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la base de datos MySQL:
   - Importa el archivo `database/db.sql` en tu servidor MySQL
   - Ajusta las credenciales de conexión en `src/app.js`

4. Ejecuta la aplicación:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del proyecto

```
src/
├── app.js              # Archivo principal de la aplicación
├── controllers/        # Controladores
│   └── customerController.js
├── routes/            # Rutas de la aplicación
│   └── customer.js
├── views/             # Vistas EJS
│   ├── pacientes.ejs
│   └── pacientes_edit.ejs
└── public/            # Archivos estáticos
    ├── css/
    ├── fonts/
    └── imagenes/
```

## Funcionalidades

- Gestión de pacientes (CRUD)
- Interfaz web responsive
- Conexión a base de datos MySQL

## Autor

Desarrollado como parte del curso Web III
