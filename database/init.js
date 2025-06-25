const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

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

connection.query(createTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table created successfully');
    }
    connection.end();
});