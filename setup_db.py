import psycopg2

def drop_tables(cursor):
    # Drop tables in reverse order to avoid foreign key constraints
    cursor.execute('DROP TABLE IF EXISTS depense_endette;')
    cursor.execute('DROP TABLE IF EXISTS depense;')
    cursor.execute('DROP TABLE IF EXISTS utilisateur_group;')
    cursor.execute('DROP TABLE IF EXISTS groupe;')
    cursor.execute('DROP TABLE IF EXISTS utilisateurs;')



def create_tables(cursor):

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
    # Table Depense
    cursor.execute('''
    CREATE TABLE depense (
        id serial PRIMARY KEY,
        id_depense varchar(50) NOT NULL,
        utilisateur_acheteur INT NOT NULL,
        utilisateur_dette INT NOT NULL,
        FOREIGN KEY (utilisateur_acheteur) REFERENCES utilisateurs(id),
        FOREIGN KEY (utilisateur_dette) REFERENCES utilisateurs(id),
        groupe INT REFERENCES groupe(id) NOT NULL,
        prix FLOAT NOT NULL,
        date DATE,
        justificatif text,
        informations text
    );
    ''')


    '''# Table Depense-endette
    cursor.execute(
    CREATE  TABLE depense_endette (
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
    INSERT INTO depense (utilisateur_acheteur, utilisateur_dette, groupe, prix, date, justificatif, informations, id_depense) VALUES
    -- Groupe 1
    (1, 2, 1, 100, '2021-01-01', 'justificatif1.jpg', 'informations1', 1),
    (1, 3, 1, 600, '2021-01-01', 'justificatif2.jpg', 'informations2', 2),
    (2, 1, 1, 160, '2021-01-01', 'justificatif3.jpg', 'informations3', 3),
    (2, 3, 1, 10000, '2021-01-01', 'justificatif4.jpg', 'informations4', 4),
    (3, 1, 1, 90, '2021-01-01', 'justificatif5.jpg', 'informations5', 5),

    -- Groupe 2
    (1, 2, 2, 120, '2021-01-02', 'justificatif6.jpg', 'informations6', 6),
    (1, 3, 2, 800, '2021-01-02', 'justificatif7.jpg', 'informations7', 7),
    (2, 1, 2, 180, '2021-01-02', 'justificatif8.jpg', 'informations8', 8),
    (2, 3, 2, 12000, '2021-01-02', 'justificatif9.jpg', 'informations9', 9),
    (3, 1, 2, 110, '2021-01-02', 'justificatif10.jpg', 'informations10', 10),

    -- Groupe 3
    (1, 2, 3, 150, '2021-01-03', 'justificatif11.jpg', 'informations11', 11),
    (1, 3, 3, 1000, '2021-01-03', 'justificatif12.jpg', 'informations12', 12),
    (2, 1, 3, 200, '2021-01-03', 'justificatif13.jpg', 'informations13', 13),
    (2, 3, 3, 15000, '2021-01-03', 'justificatif14.jpg', 'informations14', 14),
    (3, 1, 3, 120, '2021-01-03', 'justificatif15.jpg', 'informations15', 15),

    -- Groupe 4
    (1, 2, 4, 130, '2021-01-04', 'justificatif16.jpg', 'informations16', 16),
    (1, 3, 4, 900, '2021-01-04', 'justificatif17.jpg', 'informations17', 17),
    (2, 1, 4, 220, '2021-01-04', 'justificatif18.jpg', 'informations18', 18),
    (2, 1, 4, 120, '2021-01-04', 'justificatif18.jpg', 'informations18', 19),
    (1, 2, 4, 800, '2021-01-04', 'justificatif18.jpg', 'informations18', 20),
    (2, 1, 4, 50, '2021-01-04', 'justificatif18.jpg', 'informations18', 21),
    (2, 3, 4, 400, '2021-01-04', 'justificatif18.jpg', 'informations18', 22),


    -- Groupe 5
    (1, 2, 5, 140, '2021-01-05', 'justificatif19.jpg', 'informations19', 23),
    (1, 3, 5, 1100, '2021-01-05', 'justificatif20.jpg', 'informations20', 24),
    (2, 1, 5, 240, '2021-01-05', 'justificatif21.jpg', 'informations21', 25),

    -- Groupe 6
    (1, 2, 6, 150, '2021-01-06', 'justificatif22.jpg', 'informations22', 26),
    (1, 3, 6, 1200, '2021-01-06', 'justificatif23.jpg', 'informations23', 27),
    (2, 1, 6, 260, '2021-01-06', 'justificatif24.jpg', 'informations24', 28);
''')


def create_trigger(cursor):
    cursor.execute('''
    CREATE OR REPLACE FUNCTION check_depense()
    RETURNS TRIGGER AS $$
    BEGIN
        -- Vérifier que la somme ne dépasse pas la limite de INT et n'est pas négative
        IF NEW.prix < 0 OR NEW.prix > 2147483647 THEN
            RAISE EXCEPTION 'La somme doit être positive et ne pas dépasser la limite de 2 147 483 647 euros.';
        END IF;

        -- Vérifier que la date est dans le passé
        IF NEW.date > CURRENT_DATE THEN
            RAISE EXCEPTION 'La date doit être dans le passé.';
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER check_depense_trigger
    BEFORE INSERT ON depense
    FOR EACH ROW
    EXECUTE FUNCTION check_depense();
    ''')

def create_trigger_two_decimals(cursor):
    cursor.execute('''
    CREATE OR REPLACE FUNCTION enforce_two_decimals()
    RETURNS TRIGGER AS $$
    BEGIN
        -- Arrondir le prix à deux décimales
        NEW.prix := ROUND(NEW.prix::numeric, 2);
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER enforce_two_decimals_trigger
    BEFORE INSERT OR UPDATE ON depense
    FOR EACH ROW
    EXECUTE FUNCTION enforce_two_decimals();
    ''')

if __name__ == "__main__":
    conn = psycopg2.connect(
        dbname="sharecount",
        user="postgres",
        password="postgres",
        host="localhost",
        port=5432
    )
    
    cursor = conn.cursor()

    drop_tables(cursor)
    create_tables(cursor)
    create_trigger(cursor)
    create_trigger_two_decimals(cursor)    
    

    conn.commit()
    cursor.close()
    conn.close()