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

// Ruta básica de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API funcionando en Vercel',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// Manejar todas las rutas
app.all('*', (req, res) => {
    res.json({ 
        message: 'Ruta no encontrada',
        path: req.path,
        method: req.method
    });
});

module.exports = app;