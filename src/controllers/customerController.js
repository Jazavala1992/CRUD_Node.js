const controller = {};

 controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM pacientes', (err, pacientes) => {
            if (err) {
                res.json(err);
            }
            res.render('pacientes', {
                data: pacientes
            });
        }); 
    }); 
};

controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }

        conn.query('INSERT INTO pacientes set ?', [data], (err, pacientes) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                return res.status(500).send('Error en la consulta SQL');
            }

            console.log(pacientes);
            res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    console.log('ID recibido:', id); // Verificar que el ID se recibe correctamente

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error de conexión a la base de datos');
        }

        conn.query('DELETE FROM pacientes WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                return res.status(500).send('Error en la consulta SQL');
            }

            console.log('Paciente eliminado con ID:', id);
            res.json({ success: true });
        });
    });
};

// esta funcion es para editar los datos de un paciente en una vista
controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM pacientes WHERE id = ?', [id], (err, pacientes) => {
            if (err) {
                res.json(err);
            }
            res.render('pacientes_edit', {
                data: pacientes[0]
            });
        });
    });
}

controller.update = (req, res) => {
    const { id } = req.params;
    const newPaciente = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE pacientes set ? WHERE id = ?', [newPaciente, id], (err, rows) => {
            res.redirect('/');
        });
    });
} 


module.exports = controller;