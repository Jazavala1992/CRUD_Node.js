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
module.exports = (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url, method } = req;

    // Ruta principal
    if (url === '/' && method === 'GET') {
        res.status(200).json({
            message: 'API funcionando en Vercel',
            timestamp: new Date().toISOString(),
            available_endpoints: [
                '/init-pacientes - Inicializar base de datos',
                '/test - Endpoint de prueba'
            ]
        });
        return;
    }

    // Endpoint de prueba
    if (url === '/test' && method === 'GET') {
        res.status(200).json({ 
            message: 'Test endpoint working',
            env_vars: {
                has_mysql_url: !!process.env.MYSQL_URL,
                has_db_host: !!process.env.DB_HOST
            }
        });
        return;
    }

    // Inicializar base de datos
    if (url === '/init-pacientes' && method === 'GET') {
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
        return;
    }

    // Ruta no encontrada
    res.status(404).json({ 
        message: 'Ruta no encontrada',
        path: url,
        method: method
    });
};