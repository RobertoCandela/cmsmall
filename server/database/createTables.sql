-- Crea le tabelle nel database corrente
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS blocks;
DROP TABLE IF EXISTS pages;

CREATE TABLE IF NOT EXISTS users (
   id varchar(36) PRIMARY KEY,
   name varchar(50) NOT NULL,
   surname varchar(50) NOT NULL,
   username varchar(20) NOT NULL,
   email varchar(20) NOT NULL,
   password varchar(64) NOT NULL,
   salt varchar(100) NOT NULL,
   isadmin integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blocks (
   id varchar(36) PRIMARY KEY,
   blockType varchar(50) NOT NULL,
   content varchar(200) NOT NULL,
   page_blocks varchar (16) NOT NULL,
   item_order integer,
   FOREIGN KEY (page_blocks) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pages (
   id varchar(36) PRIMARY KEY,
   title varchar(50) NOT NULL,
   author varchar(50) NOT NULL,
   created_at varchar(20) NOT NULL,
   publication_date varchar(20),
   FOREIGN KEY (author) REFERENCES users(id)
);


INSERT INTO users (id, name, surname, username, email, password, salt, isadmin)
VALUES ('4aeb3f9c-4916-437d-bc5a-4f5d1e2c383a', 'admin', '', '', '', 'admin','3ab8127fe9856dc2a3c06f920dc9d15e', 1);

INSERT INTO users (id, name, surname, username, email, password, salt, isadmin)
VALUES ('ea148da9-1ed9-4e78-904e-462ab9c72e41', 'roberto', 'candela', 'rcandela','roberto.candela@studenti.polito.it', 'roberto123','8f5b2c9a41e036d9047e1730c60d8ba7', 0);

INSERT INTO pages (id, title, author, created_at, publication_date)
VALUES ('42d1f247-8c0f-4d0e-8949-20d501014d8a', 'Bifrost', 'ea148da9-1ed9-4e78-904e-462ab9c72e41', '2023-10-14T22:11:20+0000', '2023-10-14');

-- Inserimento dati nella tabella blocks
-- INSERT INTO blocks (id, name, type, contents, page_blocks, item_order)
-- VALUES ('7f5389c9-3f7e-45a5-b16a-8d29ff10c943', 'p1', 'paragraph', 'questo è un paragrafo!','42d1f247-8c0f-4d0e-8949-20d501014d8a', 1);

-- -- Inserimento dati nella tabella blocks
-- INSERT INTO blocks (id, name, type, contents, page_blocks, item_order)
-- VALUES ('d9a1a55b-0e5e-4f32-a227-979af3622eb4', 'h1', 'header', 'questo è un header!','42d1f247-8c0f-4d0e-8949-20d501014d8a', 0);

-- -- Inserimento dati nella tabella blocks
-- INSERT INTO blocks (id, name, type, contents, page_blocks, item_order)
-- VALUES ('25d259ef-6625-41f7-9eb1-862b4e123f9b', 'img1', 'image', 'questa è un immagine!','42d1f247-8c0e-8949-20d501014d8a', 2);

-- Inserimento dati nella tabella pages
