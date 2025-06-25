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
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de base de datos usando MYSQL_URL
if (process.env.MYSQL_URL) {
    const url = new URL(process.env.MYSQL_URL);
    var dbConfig = {
        host: url.hostname,
        port: parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1)
    };
}

// configuracion de middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, dbConfig, 'single'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Debug: mostrar todas las rutas registradas
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// rutas
app.use('/', customerRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public'))); 

// Endpoint para crear la tabla pacientes (que el código está esperando)
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

// empezando el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});