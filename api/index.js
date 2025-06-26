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
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url === '/' || req.url === '/api' || req.url === '/api/') {
        res.status(200).json({
            message: 'API funcionando en Vercel',
            timestamp: new Date().toISOString(),
            url: req.url,
            method: req.method,
            env_check: {
                has_mysql_url: !!process.env.MYSQL_URL,
                has_db_host: !!process.env.DB_HOST
            }
        });
    } else if (req.url === '/test') {
        res.status(200).json({
            message: 'Test endpoint working',
            dbConfig_defined: !!dbConfig
        });
    } else if (req.url === '/init-pacientes' && req.method === 'GET') {
        if (!dbConfig) {
            res.status(500).json({ 
                error: 'Database configuration not found',
                mysql_url_exists: !!process.env.MYSQL_URL
            });
            return;
        }

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
            url: req.url,
            available_routes: ['/', '/test', '/init-pacientes']
        });
    }
};