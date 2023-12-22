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
    ('Pomme', 'pomme.jpg', 'pomme'),
    ('Sunny', 'sunny.jpg', 'sunny'),
    ('Empanada', 'empanada.jpg', 'empanada'),
    ('Richarlyson', 'richarlyson.jpg', 'richarlyson'),
    ('Dapper', 'dapper.jpg', 'dapper');''')
    

    cursor.execute('''
    INSERT INTO utilisateurs (nom, prenom, photo, login, password) VALUES
    ('Baghera', 'Jones', 'baghera.jpg', 'baghera', '$2y$10$GNnOYQl3STBoc.YdjCpkAel.kVsjQlGkYW6d8spw2TQ1veesYi1/C'),
    ('BadBoyHalo', '', 'bbh.jpg', 'bbh', '$2y$10$hRlS28SyZdHNma6kJkElOuFxlVONoASxGomTPXnaPEWai7wrNPfyW'),
    ('Bagi', '', 'bagi.jpg', 'bagi', '$2y$10$3QPnjKR1Dx2SXK3n9iZCT.z/TLiUKJVIr2jufnrpnHFZ0ix2nBk7q');''')

    cursor.execute('''
    INSERT INTO utilisateur_group (id_utilisateur, id_groupe) VALUES
    (1, 1),  
    (2, 1),  
    (2, 2),  
    (3, 3),
    (3, 4),
    (3, 5),
    (3, 6),
    (1, 6),
    (2, 6)
    ; ''')

    cursor.execute('''
    INSERT INTO depense (utilisateur_acheteur, utilisateur_dette, groupe, prix, date, justificatif, informations) VALUES
    (1, 2, 1, 100, '2021-01-01', 'justificatif1.jpg', 'informations1'),
    (1, 3, 1, 600, '2021-01-01', 'justificatif2.jpg', 'informations2'),
    (2, 1, 1, 160, '2021-01-01', 'justificatif3.jpg', 'informations3'),
    (2, 3, 1, 10000, '2021-01-01', 'justificatif4.jpg', 'informations4'),
    (3, 1, 1, 90, '2021-01-01', 'justificatif5.jpg', 'informations5');
    ''')

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_tables()
