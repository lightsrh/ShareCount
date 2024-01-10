import psycopg2

def create_tables():
    conn = psycopg2.connect(
        dbname="sharecount",
        user="postgres",
        password="postgres",
        host="localhost",
        port=5432
    )
    
    cursor = conn.cursor()

    # Table Utilisateurs
    cursor.execute('''
    CREATE TABLE utilisateurs (
        id serial PRIMARY KEY,
        nom text NOT NULL,
        prenom text NOT NULL,
        photo text,
        login text NOT NULL,
        password text NOT NULL
    );
    ''')

    # Table Groupe
    cursor.execute('''
    CREATE TABLE groupe (
        id serial PRIMARY KEY,
        nom text NOT NULL,
        photo text,
        token text NOT NULL
    );
    ''')

    # Table Utilisateur-Group
    cursor.execute('''
    CREATE TABLE utilisateur_group (
        id_utilisateur INT REFERENCES utilisateurs(id) NOT NULL,
        id_groupe INT REFERENCES groupe(id) NOT NULL,
        PRIMARY KEY (id_utilisateur, id_groupe)
    );
    ''')

    # Table Depense
    cursor.execute('''
    CREATE TABLE depense (
        id serial PRIMARY KEY,
        utilisateur_acheteur INT REFERENCES utilisateurs(id) NOT NULL,
                utilisateur_dette INT REFERENCES utilisateurs(id) NOT NULL,
        groupe INT REFERENCES groupe(id) NOT NULL,
        prix INT NOT NULL,
        date DATE,
        justificatif text,
        informations text
    );
    ''')

    '''# Table Depense-endette
    cursor.execute(
    CREATE TABLE depense_endette (
        id_depense INT REFERENCES depense(id) NOT NULL,
        id_payeur INT REFERENCES utilisateurs(id) NOT NULL,
        id_endette INT REFERENCES utilisateurs(id) NOT NULL,
        PRIMARY KEY (id_depense, id_utilisateur)
    );
    )'''

    cursor.execute('''
    INSERT INTO groupe (nom, photo, token) VALUES
    ('QSMP', 'cucurucho.jpg', 'qsmp'),
    ('France', 'pomme.jpg', 'pomme'),
    ('Create', 'sunny.jpg', 'sunny'),
    ('WW', 'empanada.jpg', 'empanada'),
    ('Bresiliens', 'richarlyson.jpg', 'richarlyson'),
    ('Demons', 'dapper.jpg', 'dapper');''')
    

    cursor.execute('''
    INSERT INTO utilisateurs (prenom, nom, photo, login, password) VALUES
    ('Baghera', 'Jones', 'baghera.jpg', 'baghera', '$2b$10$pfFeLApq1IFVNcZenUDA1.j3Xk5MlAuofsKb9yfMjjHyjdOJfeHp6'),
    ('BadBoyHalo', '', 'bbh.jpg', 'bbh', '$2b$10$fEWsN6azZ2SSTbcw9OPIReZEls44osQLTwmppdrCjyJbXtb27UARe'),
    ('Sarah', '', 'bagi.jpg', 'sarah', '$2b$10$8Qxs5eUt9cnDyT39mxmxk.CRhcErgTgmX7Qr/qz2s57gtT92HF5My');''')

    cursor.execute('''
    INSERT INTO utilisateur_group (id_utilisateur, id_groupe) VALUES
    -- Groupe 1
    (1, 1),
    (2, 1),
    -- Groupe 2
    (1, 2),
    (2, 2),
    -- Groupe 3
    (1, 3),
    (2, 3),
    -- Groupe 4
    (1, 4),
    (2, 4),
    (3, 4),
    -- Groupe 5
    (1, 5),
    (2, 5),
    (3, 5),
    -- Groupe 6
    (1, 6),
    (2, 6),
    (3, 6);
''')


    cursor.execute('''
    INSERT INTO depense (utilisateur_acheteur, utilisateur_dette, groupe, prix, date, justificatif, informations) VALUES
    -- Groupe 1
    (1, 2, 1, 100, '2021-01-01', 'justificatif1.jpg', 'informations1'),
    (1, 3, 1, 600, '2021-01-01', 'justificatif2.jpg', 'informations2'),
    (2, 1, 1, 160, '2021-01-01', 'justificatif3.jpg', 'informations3'),
    (2, 3, 1, 10000, '2021-01-01', 'justificatif4.jpg', 'informations4'),
    (3, 1, 1, 90, '2021-01-01', 'justificatif5.jpg', 'informations5'),

    -- Groupe 2
    (1, 2, 2, 120, '2021-01-02', 'justificatif6.jpg', 'informations6'),
    (1, 3, 2, 800, '2021-01-02', 'justificatif7.jpg', 'informations7'),
    (2, 1, 2, 180, '2021-01-02', 'justificatif8.jpg', 'informations8'),
    (2, 3, 2, 12000, '2021-01-02', 'justificatif9.jpg', 'informations9'),
    (3, 1, 2, 110, '2021-01-02', 'justificatif10.jpg', 'informations10'),

    -- Groupe 3
    (1, 2, 3, 150, '2021-01-03', 'justificatif11.jpg', 'informations11'),
    (1, 3, 3, 1000, '2021-01-03', 'justificatif12.jpg', 'informations12'),
    (2, 1, 3, 200, '2021-01-03', 'justificatif13.jpg', 'informations13'),
    (2, 3, 3, 15000, '2021-01-03', 'justificatif14.jpg', 'informations14'),
    (3, 1, 3, 120, '2021-01-03', 'justificatif15.jpg', 'informations15'),

    -- Groupe 4
    (1, 2, 4, 130, '2021-01-04', 'justificatif16.jpg', 'informations16'),
    (1, 3, 4, 900, '2021-01-04', 'justificatif17.jpg', 'informations17'),
    (2, 1, 4, 220, '2021-01-04', 'justificatif18.jpg', 'informations18'),
    (2, 1, 4, 120, '2021-01-04', 'justificatif18.jpg', 'informations18'),
    (1, 2, 4, 800, '2021-01-04', 'justificatif18.jpg', 'informations18'),
    (2, 1, 4, 50, '2021-01-04', 'justificatif18.jpg', 'informations18'),
    (2, 3, 4, 400, '2021-01-04', 'justificatif18.jpg', 'informations18'),


    -- Groupe 5
    (1, 2, 5, 140, '2021-01-05', 'justificatif19.jpg', 'informations19'),
    (1, 3, 5, 1100, '2021-01-05', 'justificatif20.jpg', 'informations20'),
    (2, 1, 5, 240, '2021-01-05', 'justificatif21.jpg', 'informations21'),

    -- Groupe 6
    (1, 2, 6, 150, '2021-01-06', 'justificatif22.jpg', 'informations22'),
    (1, 3, 6, 1200, '2021-01-06', 'justificatif23.jpg', 'informations23'),
    (2, 1, 6, 260, '2021-01-06', 'justificatif24.jpg', 'informations24');
''')


    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_tables()
