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
        photo text
    );
    ''')

    # Table Groupe
    cursor.execute('''
    CREATE TABLE groupe (
        id serial PRIMARY KEY,
        nom text NOT NULL,
        photo text
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

    cursor.execute('''
    INSERT INTO groupe (nom, photo) VALUES
    ('Groupe A', '/home/sarah/Documents/Web/ShareCount/front/public/img/cucurucho.jpg'),
    ('Groupe B', 'photo_groupe_b.jpg'),
    ('Groupe C', 'photo_groupe_c.jpg');''')

    cursor.execute('''
    INSERT INTO utilisateurs (nom, prenom, photo) VALUES
    ('Doe', 'John', 'john_doe.jpg'),
    ('Smith', 'Alice', 'alice_smith.jpg'),
    ('Johnson', 'Bob', 'bob_johnson.jpg');''')

    cursor.execute('''
    INSERT INTO utilisateur_group (id_utilisateur, id_groupe) VALUES
    (1, 1),  
    (2, 1),  
    (2, 2),  
    (3, 3); ''')






    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_tables()
