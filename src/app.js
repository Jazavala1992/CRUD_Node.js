require('dotenv').config();
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

// configuracion de middlewares (funciones que se ejecutam antes de las petciones de los usuarios)
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'practica_2'
} ,'single' ));
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
