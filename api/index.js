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

// Vercel espera una función que reciba (req, res)
export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/') {
        res.status(200).json({
            message: 'API funcionando en Vercel',
            timestamp: new Date().toISOString(),
            url: req.url,
            method: req.method
        });
    } else if (req.url === '/test') {
        res.status(200).json({
            message: 'Test endpoint working'
        });
    } else if (req.url === '/init-pacientes' && req.method === 'GET') {
        const connection = mysql.createConnection(dbConfig);
        
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
        
        connection.query(createTableQuery, (err, results) => {
            connection.end();
            
            if (err) {
                res.status(500).json({ 
                    error: 'Table creation failed', 
                    details: err.message 
                });
                return;
            }
            
            res.status(200).json({ 
                message: 'Table pacientes created successfully', 
                results 
            });
        });
    } else {
        res.status(404).json({
            message: 'Ruta no encontrada',
            url: req.url
        });
    }
};