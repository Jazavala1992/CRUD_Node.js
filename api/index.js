require('dotenv').config();

const mysql = require('mysql2');

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
}

// Usar module.exports en lugar de export default
module.exports = (req, res) => {
    res.status(200).json({
        message: 'Hello from Vercel!',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
    });
};