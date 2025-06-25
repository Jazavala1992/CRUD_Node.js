use practica_2;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  `apellido` varchar(20) NOT NULL,
  `edad` INT(11) NOT NULL,
  `talla` DECIMAL(5,2) NOT NULL,
  `peso` INT(11) NOT NULL,
  `sexo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;