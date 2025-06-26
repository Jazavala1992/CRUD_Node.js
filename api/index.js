require('dotenv').config();

const express = require('express');
const path = require('path'); 
const morgan = require('morgan');
const mysql = require('mysql2');
const myConnection = require('express-myconnection');

const app = express();

// Configurar EJS para Vercel
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'src', 'views'));

// Configuración de base de datos
let dbConfig;

if (process.env.MYSQL_URL) {
    const url = new URL(process.env.MYSQL_URL);
    dbConfig = {
        host: url.hostname,
        port: parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1),
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
    };
} else {
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

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(myConnection(mysql, dbConfig, 'single'));

// Ruta de prueba simple
app.get('/', (req, res) => {
    res.json({ 
        message: 'Aplicación funcionando en Vercel',
        timestamp: new Date().toISOString()
    });
});

// Endpoint para crear tabla
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

// Incluir rutas de customer
try {
    const customerRoutes = require('../src/routes/customer');
    app.use('/', customerRoutes);
} catch (error) {
    console.log('Customer routes not found:', error.message);
}

module.exports = app;