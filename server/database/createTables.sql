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
   isAdmin integer DEFAULT 0
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
   created_at TEXT,
   publication_date TEXT,
   FOREIGN KEY (author) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS settings (
   id varchar(10) PRIMARY KEY,
   value varchar(10) NOT NULL
);


INSERT INTO users (id, name, surname, username, email, password, salt, isAdmin)
VALUES ('4aeb3f9c-4916-437d-bc5a-4f5d1e2c383a', 'admin', 'admin', 'admin', 'admin@cmsmall.com', '912bb56154e7e99e7911e488c4a04fb5ee304256f22c4933f648c44baba5aedc','ba28b7c2f336a3e43fe1b1b7a153a602', 1);

INSERT INTO settings (id,value)
VALUES ('appName','CMSMall');

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
