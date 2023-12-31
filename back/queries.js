const { Pool } = require('pg');
const path = require('path');
const { response } = require('express');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sharecount', // Nom de la base de données que vous avez créée
    password: 'postgres',
    port: 5432,
});

function getLogin(username, response) {
    pool.query('SELECT login, password FROM utilisateurs WHERE login = $1 LIMIT 1', [username], (error, results) => {
      if (error) {
        console.error('Erreur lors de la requête SQL :', error);
        response.sendStatus(500);
      } else {
        if (results.rows.length === 0) {
          // Aucun utilisateur trouvé avec ce nom d'utilisateur
          response.sendStatus(401);
        } else {
          // Utilisateur trouvé, retournez les informations
          response.status(200).json(results.rows);
        }
      }
    });
  }
  

  function getGroups(request, response) {
    login = request.session.userid;
    pool.query('select id from utilisateurs where login = $1;', [login], (error, results) => {
        if (error) {
            throw error;
        }
        userId = results.rows[0].id;
        pool.query('SELECT g.* FROM groupe g INNER JOIN utilisateur_group ug ON g.id = ug.id_groupe WHERE ug.id_utilisateur = $1;', [userId], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    });
    
}


function getUsers(request, response) {
    const groupId = request.params.groupId;

    pool.query(
        'SELECT utilisateurs.nom, utilisateurs.prenom, utilisateurs.photo, utilisateurs.login FROM utilisateur_group INNER JOIN utilisateurs ON utilisateur_group.id_utilisateur  = utilisateurs.id WHERE utilisateur_group.id_groupe = $1;',
        [groupId],
        (error, results) => {
            if (error) {
                response.status(500).json({ error });
            } else {
                response.status(200).json(results.rows);
            }
        }
    );
}

function getToken (request, response) {
    const groupId = request.params.groupId;
    pool.query(
        'SELECT token FROM groupe WHERE id = $1;',
        [groupId],
        (error, results) => {
            if (error) {
                response.status(500).json({ error });
            } else {
                response.status(200).json(results.rows);
            }
        }
    );
}


function createUser(request, response, nom, prenom, photo, username, password) {
    pool.query('select login from utilisateurs where login = $1', [username], (error, results) => {
        if (results.rows.length === 0) {
            pool.query('INSERT INTO utilisateurs (nom, prenom, photo, login, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nom, prenom, photo, username, password], (error, results) => {
                if (error) {
                    throw error;
                }
                response.status(200).json(results.rows[0].login);
            }
            );
        }
        else {
            response.status(400).json({ error: 'username_already_exists' });
                }
    }
    );

}


function addToGroup(response, idUser, idGroup) {

    pool.query('SELECT * FROM utilisateur_group WHERE id_utilisateur = $1 AND id_groupe = $2', [idUser, idGroup], (selectError, selectResults) => {
        if (selectError) {
            throw selectError;
        }

        if (selectResults.rows.length === 0) {
            pool.query('INSERT INTO utilisateur_group (id_utilisateur, id_groupe) VALUES ($1, $2) RETURNING *', [idUser, idGroup], (insertError, insertResults) => {
                if (insertError) {
                    throw insertError;
                }
                response.status(200).json(insertResults.rows);
            });
        } else {
            response.status(400).json({ error: 'La relation entre l\'utilisateur et le groupe existe déjà.' });
        }
    });
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

function getDepenses(request, response) {
    console.log("getDepense");
    const groupId = request.params.groupId;
    pool.query(
        {
            text: `
                SELECT
                    utilisateur_1,
                    utilisateur_2,
                    SUM(total_depense) - COALESCE(SUM(total_remboursement), 0) as difference
                FROM (
                    SELECT
                        d.utilisateur_acheteur as utilisateur_1,
                        d.utilisateur_dette as utilisateur_2,
                        SUM(d.prix) as total_depense
                    FROM
                        depense d
                    WHERE
                        d.groupe = $1
                    GROUP BY
                        d.utilisateur_acheteur,
                        d.utilisateur_dette
                ) AS subquery
                LEFT JOIN (
                    SELECT
                        d2.utilisateur_acheteur as utilisateur_3,
                        d2.utilisateur_dette as utilisateur_4,
                        SUM(d2.prix) as total_remboursement
                    FROM
                        depense d2
                    WHERE
                        d2.groupe = $1
                    GROUP BY
                        d2.utilisateur_acheteur,
                        d2.utilisateur_dette
                ) AS remboursements ON
                    subquery.utilisateur_1 = remboursements.utilisateur_4 AND
                    subquery.utilisateur_2 = remboursements.utilisateur_3
                GROUP BY
                    utilisateur_1,
                    utilisateur_2;
            `,
            values: [groupId]
        },
        (error, results) => {
            if (error) {
                console.error("Erreur :", error);
                response.status(500).json({ error: "Erreur lors de la récupération des dépenses" });
            } else {
                const dettes = results.rows.map(row => ({
                    utilisateur_1: row.utilisateur_1,
                    utilisateur_2: row.utilisateur_2,
                    difference: parseInt(row.difference, 10)
                }));

                console.log("dettes : ", dettes);

                const filteredDettes = dettes.reduce((acc, curr) => {
                    const { utilisateur_1, utilisateur_2, difference } = curr;
                    const existingDetteIndex = acc.findIndex(dette => (
                        dette.utilisateur_1 === utilisateur_2 && dette.utilisateur_2 === utilisateur_1
                    ));
                
                    if (existingDetteIndex !== -1) {
                        const existingDette = acc[existingDetteIndex];
                        existingDette.difference += difference;
            
                        // Ne pas ajouter la dette au nouveau tableau si la différence est nulle
                        if (existingDette.difference !== 0) {
                            acc.push(existingDette);
                        }
                    } else if (difference !== 0) {
                        acc.push(curr);
                    }
                
                    return acc;
                }, []);
                console.log("filteredDettes : ", filteredDettes);         
                
                filteredDettes.forEach((dette) => {
                        dettes.push({
                            utilisateur_1: dette.utilisateur_2,
                            utilisateur_2: dette.utilisateur_1,
                            difference: -dette.difference
                        });
                        console.log("nouveau tableau de dettes : ",dettes);
                });
                
                console.log(dettes);
                response.status(200).json(dettes);
            }
        }
    );
}








module.exports = {
    getUsers,
    createUser,
    deleteById,
    getGroups,
    getLogin,
    addToGroup,
    getToken,
    addToGroup,
    getDepenses
};
