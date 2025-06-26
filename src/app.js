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

// rutas
app.use('/', customerRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public'))); 

// empezando el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});