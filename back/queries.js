const { Pool } = require('pg');

const pool = new Pool({
    user: 'test',
    host: 'postgresql.local',
    database: 'base_test',
    password: 'test',
    port: 5432,
});

function getGroups(request, response) {
    pool.query('SELECT * FROM groups;', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

function getUsers(request, response) {
    const groupId = request.params.groupId;

    pool.query(
        'SELECT users.* FROM usergroup INNER JOIN users ON usergroup.utilisateur_id = users.id WHERE usergroup.groupe_id = $1;',
        [groupId],
        (error, results) => {
            if (error) {
                response.status(500).json({ error });
            }
            response.status(200).json(results.rows);
        }
    );
}



function addMember(request, response){
    pool.query('INSERT INTO users (nom, prenom) VALUES ($1, $2)', [request.body.nom, request.body.prenom], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    }
    );
}

function create(request, response) {
    const { id, nom, prenom, depense } = request.body;

    pool.query(
        'INSERT INTO table_test (id, nom, prenom, depense) VALUES ($1, $2, $3, $4)',
        [id, nom, prenom, depense],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        }
    );
}

function deleteById(request, response) {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM table_test WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
}

module.exports = {
    getUsers,
    create,
    deleteById,
    addMember,
    getGroups
};
