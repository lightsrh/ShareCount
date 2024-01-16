const { Pool } = require('pg');
const path = require('path');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');



const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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
    login = request.session.userLogin;
    pool.query('select id from utilisateurs where login = $1;', [login], (error, results) => {
        if (error) {
            throw error;
        }
        userLogin = results.rows[0].id;
        pool.query('SELECT g.* FROM groupe g INNER JOIN utilisateur_group ug ON g.id = ug.id_groupe WHERE ug.id_utilisateur = $1;', [userLogin], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    });
    
}


function getUsers(request, response) {
    const groupId = request.params.groupId;
    const userLogin = request.session.userLogin;
    pool.query('select id from utilisateurs where login = $1;', [userLogin], (error, results) => {
        if (error) {
            throw error;
        }
        const userId = results.rows[0].id;
    
        pool.query('select * from utilisateur_group where id_utilisateur = $1 and id_groupe = $2;', [userId, groupId], (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rows.length === 0) {
                response.status(401).json({ error: 'user_not_found' });
            }
            else {
                pool.query(
                    'SELECT utilisateurs.id, utilisateurs.nom, utilisateurs.prenom, utilisateurs.photo, utilisateurs.login FROM utilisateur_group INNER JOIN utilisateurs ON utilisateur_group.id_utilisateur  = utilisateurs.id WHERE utilisateur_group.id_groupe = $1;',
                    [groupId],
                    (error, results) => {
                        if (error) {
                            response.status(500).json({ error });
                        } else {
                            response.status(200).json(results.rows);
                        }
                    }
                );  
            }}); 
     });  
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
                // Convertir les résultats de la requête en un tableau de dettes
                const dettes = results.rows.map(row => ({
                    utilisateur_1: row.utilisateur_1,
                    utilisateur_2: row.utilisateur_2,
                    difference: parseInt(row.difference, 10)
                }));

                
                let dettes2 = dettes;

                dettes2 = dettes2.filter(dette => dette.difference !== 0);

                for (let i = 0; i < dettes2.length; i++) {
                    for (let j = 0; j < dettes2.length; j++) {
                        if (dettes2[i].utilisateur_1 === dettes2[j].utilisateur_2 && dettes2[i].utilisateur_2 === dettes2[j].utilisateur_1 && dettes2[i].difference === -dettes2[j].difference) {
                            dettes2.splice(j, 1);
                        }
                    }
                }
                
                response.status(200).json(dettes2);
            }
        }
    );
}

function getTransactions(request, response) {
    const groupId = request.params.groupId;
    pool.query('SELECT * FROM depense WHERE groupe = $1;', [groupId], (error, results) => {
        if (error) {
            console.error("Erreur :", error);
            response.status(500).json({ error: "Erreur lors de la récupération des transactions" });
        } else {
            const promises = results.rows.map((element) => {
                return new Promise((resolve, reject) => {
                    pool.query('SELECT prenom, nom FROM utilisateurs WHERE id = $1;', [element.utilisateur_acheteur], (error, results2) => {
                        if (error) {
                            console.error("Erreur :", error);
                            reject("Erreur lors de la récupération des transactions");
                        } else {
                            element.utilisateur_acheteur = results2.rows[0].prenom + " " + results2.rows[0].nom;

                            const subPromises = [];
                                subPromises.push(new Promise((resolveSub, rejectSub) => {
                                    pool.query('SELECT prenom, nom FROM utilisateurs WHERE id = $1;', [element.utilisateur_dette], (error, results3) => {
                                        if (error) {
                                            console.error("Erreur :", error);
                                            rejectSub("Erreur lors de la récupération des transactions");
                                        } else {
                                            
                                                element.utilisateur_dette = results3.rows[0].prenom + " " + results3.rows[0].nom;
                                            
                                            resolveSub();
                                        }
                                    });
                                }));

                            Promise.all(subPromises)
                                .then(() => {
                                    resolve();
                                })
                                .catch((subError) => {
                                    reject(subError);
                                });
                        }
                    });
                });
            });

            Promise.all(promises)
                .then(() => {
                    response.status(200).json(results.rows);
                })
                .catch((error) => {
                    response.status(500).json({ error });
                });
        }
    });
}

    

function rembourser(request, response) {
    const { utilisateur_1, utilisateur_2, groupId, date, montant  } = request.body;
        const titre = "Remboursement";
        const id_depense = uuidv4(); 
    pool.query('INSERT INTO depense (utilisateur_acheteur, utilisateur_dette, groupe, prix, date, titre, id_depense, total_prix) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [utilisateur_1, utilisateur_2, groupId, montant, date, titre, id_depense, montant], (error, results) => {
        if (error) {
            console.error("Erreur :", error);
            response.status(500).json({ error: "Erreur lors de la récupération des dépenses" });
        } else {
                                        response.status(200).json(results.rows);
                                }
    });
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
    getDepenses,
    getTransactions,
    rembourser
};


/*
                // Filtrer les dettes pour combiner les différences entre utilisateurs
                const filteredDettes = dettes.reduce((acc, curr) => {
                    const { utilisateur_1, utilisateur_2, difference } = curr;
                    const existingDetteIndex = acc.findIndex(dette => (
                        dette.utilisateur_1 === utilisateur_2 && dette.utilisateur_2 === utilisateur_1
                    ));
                
                    if (existingDetteIndex !== -1) {
                        // Si une dette existante est trouvée, ajuster la différence
                        const existingDette = acc[existingDetteIndex];
                        existingDette.difference += difference;
                
                        // Ne pas ajouter la dette au nouveau tableau si la différence est nulle
                        if (existingDette.difference !== 0) {
                            acc.push({ ...existingDette }); // Ajouter un nouvel objet avec les valeurs actuelles
                        }
                    } else if (difference !== 0) {
                        // Ajouter une nouvelle dette si la différence est non nulle
                        acc.push({ ...curr }); // Ajouter un nouvel objet avec les valeurs actuelles
                    }
                
                    return acc;
                }, []);

                // Supprimer les dettes avec une différence nulle du tableau filtré
                filteredDettes.forEach((dette, index) => {
                    if (dette.difference === 0) {
                        filteredDettes.splice(index, 1);
                    }
                });

                // Inverser les utilisateurs et les différences pour créer un nouveau tableau de dettes
                var dettes2 = [];
                filteredDettes.forEach((dette) => {
                    dettes2.push({
                        utilisateur_1: dette.utilisateur_2,
                        utilisateur_2: dette.utilisateur_1,
                        difference: -dette.difference
                    });
                });

                dettes2 = dettes2.concat(dettes);
                for (depense in dettes2) {
                    if (depense.difference == 0) {
                        dettes2.splice(depense, 1);
                    }
                }*/