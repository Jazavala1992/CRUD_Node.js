require('dotenv').config();

const express = require('express');
const path = require('path'); 
const morgan = require('morgan');
const mysql = require('mysql2');
const myConnection = require('express-myconnection');
const app = express();

// importando rutas
const customerRoutes = require('./routes/customer'); 

// Configuracion para nodejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de base de datos
let dbConfig;

// Para Vercel, necesitarás una base de datos externa
if (process.env.MYSQL_URL) {
    const url = new URL(process.env.MYSQL_URL);
    dbConfig = {
        host: url.hostname,
        port: parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1),
        // Configuraciones adicionales para serverless
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
    };
} else {
    // Variables individuales como fallback
    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
    };
}

// configuracion de middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, dbConfig, 'single'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Endpoint para crear la tabla pacientes
app.get('/init-pacientes', (req, res) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS pacientes (
            id int(11) NOT NULL AUTO_INCREMENT,
            nombre varchar(20) NOT NULL,
            apellido varchar(20) NOT NULL,
            edad INT(11) NOT NULL,
            talla DECIMAL(5,2) NOT NULL,
            peso INT(11) NOT NULL,
            sexo varchar(20) NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;
    
    req.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Database connection failed', details: err.message });
        }
        
        connection.query(createTableQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Table creation failed', details: err });
            }
            res.json({ message: 'Table pacientes created successfully', results });
        });
    });
});

// rutas
app.use('/', customerRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public'))); 

// Para Vercel, exportar la app en lugar de listen
if (process.env.VERCEL) {
    module.exports = app;
} else {
    // Para desarrollo local y Railway
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}