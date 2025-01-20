CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    score INT NOT NULL
);

-- Insert tasks
INSERT INTO tasks (category, name, score) VALUES
    ('Putzen', 'Saugen', 200),
    ('Putzen', 'Aufnehmen', 200),
    ('Putzen', 'Abstauben', 400),
    ('Putzen', 'Bad', 300),
    ('Putzen', 'Küche', 300),
    ('Putzen', 'Fenster', 500),
    ('Kochen', 'Frühstück', 250),
    ('Kochen', 'Mittagessen', 500),
    ('Kochen', 'Abendessen', 500),
    ('Waschen', 'Waschen', 250),
    ('Waschen', 'Aufhängen', 250),
    ('Waschen', 'Verräumen', 250);
