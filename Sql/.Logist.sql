create database logist;

use logist;

-- ------------------------------------tables------------------------------------
DROP table IF EXISTS user_table;

create table user_table(
    id int NOT NULL AUTO_INCREMENT,
    avatar text,
    full_name text,
    phone_number varchar(20) NOT NULL,
    gender enum("male", "female", "N/A") NOT NULL,
    birth_date date NOT NULL,
    adrress text,
    email text,
    user_location int,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (phone_number)
);

DROP table IF EXISTS location;

DROP table IF EXISTS location;

create table location(
    id int NOT NULL AUTO_INCREMENT,
    latitude FLOAT,
    longitude FLOAT,
    PRIMARY KEY(id)
);

drop table if EXISTS trailler_types;

create table trailler_types(
    id int NOT NULL AUTO_INCREMENT,
    trailer_name text,
    tailer_description text,
    trailer_photo text,
    PRIMARY KEY(id)
);

drop table if EXISTS shipping_method;

create TABLE shipping_method(
    id int NOT NULL AUTO_INCREMENT,
    shipping_name text,
    shipping_description text,
    shipping_photo text,
    PRIMARY KEY(id)
);

drop table if EXISTS vehicle_type;

create TABLE vehicle_type(
    id int NOT NULL AUTO_INCREMENT,
    vehicle_type_name text,
    PRIMARY KEY(id)
);

DROP table IF EXISTS driver;

create table driver(
    id int NOT NULL AUTO_INCREMENT,
    user_id int,
    nationality TEXT,
    identity_card text,
    license text,
    vehicle_register_number text,
    plate_number text,
    identity_card_photo_front text,
    identity_card_photo_back text,
    lecense_photo text,
    vehicle_type_id int,
    FOREIGN KEY (user_id) REFERENCES user_table(id),
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_type(id),
    PRIMARY KEY(id)
);

drop table if EXISTS drivers_trailler_type;

create Table drivers_trailler_type(
    id int NOT NULL AUTO_INCREMENT,
    trailer_id int,
    driver_id int,
    FOREIGN KEY (trailer_id) REFERENCES trailler_types(id),
    FOREIGN KEY(driver_id) REFERENCES driver(id),
    PRIMARY KEY(id)
);

drop table if EXISTS drivers_shipping_method;

create TABLE drivers_shipping_method(
    id INT NOT NULL AUTO_INCREMENT,
    shipping_method_id int,
    driver_id int,
    FOREIGN KEY(shipping_method_id) REFERENCES shipping_method(id),
    FOREIGN KEY(driver_id) REFERENCES driver(id),
    PRIMARY KEY(id)
);

drop table if EXISTS OrderTable;

create TABLE OrderTable(
    id INT AUTO_INCREMENT,
    Driver_ID int,
    user_id int,
    Date_of_Order DATE,
    Distination int,
    location int,
    Accepted BOOLEAN,
    Canceled BOOLEAN,
    viecle_Id int,
    trailer_id INT,
    Current_Location int,
    Order_Type enum(
        'Single',
        'multiple shopment',
        'multiple locations'
    ) NOT NULL,
    Order_Complited BOOLEAN,
    Order_Start_Time DATE,
    FOREIGN KEY(Driver_ID) REFERENCES driver(id),
    FOREIGN KEY(user_id) REFERENCES user_table(id),
    FOREIGN KEY(viecle_Id) REFERENCES vehicle_type(id),
    FOREIGN KEY(Distination) REFERENCES location(id),
    FOREIGN KEY(location) REFERENCES location(id),
    FOREIGN KEY(Current_Location) REFERENCES location(id),
    FOREIGN KEY(trailer_id) REFERENCES trailler_types(id),
    PRIMARY KEY(id)
);

DROP TABLE if EXISTS Ticket;

CREATE TABLE Ticket(
    id int AUTO_INCREMENT,
    user_id INT,
    Type TEXT,
    Email TEXT,
    Subject TEXT,
    Responeded BOOLEAN,
    Issued_Date DATE,
    FOREIGN KEY(user_id) REFERENCES user_table(id),
    PRIMARY KEY(id)
);

DROP TABLE if EXISTS Reviews;

CREATE TABLE Reviews(
    id int not null AUTO_INCREMENT,
    driver_id int,
    user_id int,
    Rating INT,
    review_date DATE,
    FOREIGN KEY(driver_id) REFERENCES driver(id),
    FOREIGN KEY(user_id) REFERENCES user_table(id),
    PRIMARY KEY(id)
);

--------------------------------------------------------------------------------
------- create driver row ----
insert into
    trailler_types (trailer_name, tailer_description, trailer_photo)
values
("", "", "");

insert into
    drivers_shipping_method (shipping_method_id, driver_id)
values
(1, 1);

insert into
    drivers_trailler_type (trailer_id, driver_id)
values
(1, 1);

insert into
    driver(
        user_id,
        nationality,
        identity_card,
        license,
        vehicle_register_number,
        plate_number,
        identity_card_photo_front,
        identity_card_photo_back,
        lecense_photo,
        vehicle_type_id
    );

SELECT
    *
from
    driver
    INNER JOIN user_table ON user_table.id = driver.user_id
    INNER JOIN user_location on user_table.id = user_location.user_id
    inner JOIN reviews on reviews.driver_id = driver.id;

insert into
    user_table(
        `avatar`,
        `full_name`,
        `phone_number`,
        `gender`,
        birth_date,
        adrress,
        email,
        user_location,
        created_date
    )
values
(
        '/img/avatar-USER#440-1660342077650.jpg',
        'USER#0',
        '+212789541112',
        "female",
        CURRENT_DATE(),
        'adrress#0000',
        "",
        0,
        CURRENT_DATE()
    );

insert into
    user_table(
        avatar,
        full_name,
        phone_number,
        gender,
        birth_date,
        adrress,
        email,
        created_date
    )
values
(
        "",
        "Ayoub Aitouna",
        "+212636047860",
        "male",
        CURRENT_DATE(),
        "souk sebt ouled nemma",
        "Aitouna@gmail.com",
        CURRENT_DATE()
    );

select
    *
from
    user_table;