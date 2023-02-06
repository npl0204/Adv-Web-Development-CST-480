-- Insert 1 Author with auto increment id, name and bio into authors table
INSERT INTO authors (id, name, bio) VALUES (1, 'J.R.R. Tolkien', 'J.R.R. Tolkien was an English writer, poet, philologist, and university professor who is best known as the author of the classic high fantasy works The Hobbit, The Lord of the Rings, and The Silmarillion.');

-- Insert 1 book with author_id, title, pub_year, genre into books table
INSERT INTO books (id, author_id, title, pub_year, genre) VALUES (1, 1, 'The Hobbit', 1937, 'Fantasy');
