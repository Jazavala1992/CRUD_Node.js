require('dotenv').config();

// Debug completo de TODAS las variables
console.log('=== ALL ENVIRONMENT VARIABLES ===');
Object.keys(process.env).forEach(key => {
    if (key.includes('MYSQL') || key.includes('DATABASE') || key.startsWith('DB_') || key === 'PORT') {
        console.log(`${key}: "${process.env[key]}"`);
    }
});
console.log('================================');

const express = require('express');
const path = require('path'); 
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();

// importando rutas
const customerRoutes = require('./routes/customer'); 

// Configuracion para nodejs
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de base de datos usando MYSQL_URL o variables individuales
let dbConfig;

if (process.env.MYSQL_URL) {
    // Usar MYSQL_URL que Railway proporciona automáticamente
    const url = new URL(process.env.MYSQL_URL);
    dbConfig = {
        host: url.hostname,
        port: parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1) // remover el '/' inicial
    };
    console.log('Using MYSQL_URL config');
} else {
    // Fallback a variables individuales
    dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || 'practica_2'
    };
    console.log('Using individual DB_ variables');
}

console.log('Final DB config:', { ...dbConfig, password: dbConfig.password ? '***' : 'undefined' });

// configuracion de middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, dbConfig, 'single'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// rutas
app.use('/', customerRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public'))); 


// Endpoint temporal para inicializar la base de datos
app.get('/init-db', (req, res) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
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
            return res.status(500).json({ error: 'Database connection failed' });
        }
        
        connection.query(createTableQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Table creation failed', details: err });
            }
            res.json({ message: 'Table created successfully', results });
        });
    });
});

// empezando el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
