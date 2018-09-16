PRAGMA foreign_keys = ON;
DROP table IF EXISTS customers;
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT(16),
  first_name TEXT(64) NOT NULL,
  surname TEXT(64) NOT NULL,
  email TEXT(64)
);
DROP table IF EXISTS room_types;
CREATE TABLE IF NOT EXISTS room_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_name TEXT(64) NOT NULL,
  original_price number,
  current_price number,
  room_details integer DEFAULT 0
);
DROP table IF EXISTS rooms;
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_type_id INTEGER NOT NULL,
  sea_view boolean,
  room_details integer DEFAULT 0,
  foreign key (room_type_id) references room_types(id)
);
DROP table IF EXISTS reservations;
create table IF NOT EXISTS reservations (
  id integer primary key AUTOINCREMENT,
  customer_id integer not null,
  room_id integer not null,
  check_in_date datetime not null,
  check_out_date datetime,
  room_price number,
  foreign key (customer_id) references customers(id),
  foreign key (room_id) references rooms(id)
);
DROP table IF EXISTS invoices;
create table IF NOT EXISTS invoices (
  id integer primary key AUTOINCREMENT,
  reservation_id integer not null,
  total number,
  surcharges number,
  invoice_date_time datetime,
  paid boolean,
  foreign key (reservation_id) references reservations(id)
);
DROP table IF EXISTS reviews;
create table IF NOT EXISTS reviews (
  id integer primary key AUTOINCREMENT,
  customer_id integer not null,
  room_type_id integer not null,
  rating integer,
  comment text,
  review_date datetime,
  foreign key (customer_id) references customers(id),
  foreign key (room_type_id) references room_types(id)
);
INSERT INTO customers (title, first_name, surname, email) VALUES ('Mr', 'John', 'Dove', 'john.doe@domain.com');
INSERT INTO customers (title, first_name, surname, email) VALUES ('Mr', 'Jim', 'Frlton', 'jim.f@domain.com');
INSERT INTO customers (title, first_name, surname, email) VALUES ('Mr', 'Keke', 'Lili', 'keke.lili@domain.com');
INSERT INTO customers (title, first_name, surname, email) VALUES ('Ms', 'Joanna','Smith','j.smith@domain.com');
INSERT INTO customers (title, first_name, surname, email) VALUES ('Ms', 'Anna','Kolen','a.col@domain.com');
INSERT INTO customers (title, first_name, surname, email) VALUES ('Ms', 'Marie','Niki','m.niki@domain.com');
INSERT INTO customers (title, first_name, surname, email) VALUES ('Ms', 'Cherie','Mart','c.mart@domain.com');
INSERT INTO customers (title, first_name, surname, email) VALUES ('Mr', 'John','Dove','john.dove@domain.com');
INSERT INTO room_types (type_name, original_price, current_price) VALUES ('Single room', 40, 50.50 );
INSERT INTO room_types (type_name, original_price, current_price) VALUES ('Double room', 60, 80 );
INSERT INTO room_types (type_name, original_price, current_price) VALUES ('Suite', 100, 120 );
INSERT INTO rooms (room_type_id, sea_view) VALUES (1, 0);
INSERT INTO rooms (room_type_id, sea_view) VALUES (2, 0);
INSERT INTO rooms (room_type_id, sea_view) VALUES (2, 1);
INSERT INTO rooms (room_type_id, sea_view) VALUES (1, 1);
INSERT INTO rooms (room_type_id, sea_view) VALUES (2, 0);
INSERT INTO rooms (room_type_id, sea_view) VALUES (2, 1);
INSERT INTO rooms (room_type_id, sea_view) VALUES (1, 1);
INSERT INTO reservations (customer_id, room_id, check_in_date, check_out_date, room_price) VALUES (1, 2, '2017-07-11', '2017-10-11', 80);
INSERT INTO reservations (customer_id, room_id, check_in_date, room_price) VALUES (2, 3, '2017-05-11', 80);
INSERT INTO reservations (customer_id, room_id, check_in_date, room_price) VALUES (2, 4, '2018-08-14', 50.50);
INSERT INTO reservations (customer_id, room_id, check_in_date, check_out_date, room_price) VALUES (2, 1, '2018-08-15', '2018-08-25', 50.50);
INSERT INTO reservations (customer_id, room_id, check_in_date, room_price) VALUES (6, 2, '2018-08-19', 80);
INSERT INTO reservations (customer_id, room_id, check_in_date, room_price) VALUES (5, 1, '2018-08-19', 80);
INSERT INTO invoices (reservation_id, total, surcharges, invoice_date_time, paid) VALUES (1, 700, 50, '2017-08-01', 1);
INSERT INTO invoices (reservation_id, total, surcharges, invoice_date_time, paid) VALUES (2, 1000, 550, '2017-08-08', 0);
INSERT INTO invoices (reservation_id, total, surcharges, invoice_date_time, paid) VALUES (3, 200, 50, '2018-08-25', 1);
INSERT INTO invoices (reservation_id, total, surcharges, invoice_date_time, paid) VALUES (4, 7700, 50, '2018-09-07', 1);
INSERT INTO invoices (reservation_id, total, surcharges, invoice_date_time, paid) VALUES (5, 600, 50, '2018-09-14', 0);
INSERT into reviews (customer_id, room_type_id, rating, comment, review_date) VALUES (1, 2, 4, 'Great room and beautiful hotel', '2018-09-01');
INSERT into reviews (customer_id, room_type_id, rating, comment, review_date) VALUES (2, 3, 3, 'Beautiful hotel', '2018-09-01');
INSERT into reviews (customer_id, room_type_id, rating, comment, review_date) VALUES (4, 1, 5, 'Wonderful service', '2018-09-01');
INSERT into reviews (customer_id, room_type_id, rating, comment, review_date) VALUES (3, 1, 4, 'Great hotel', '2018-09-01');