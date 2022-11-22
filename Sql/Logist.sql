use defaultdb;

-- ------------------------------------tables------------------------------------
DROP table IF EXISTS user_table;

create table user_table(
    id int NOT NULL AUTO_INCREMENT,
    avatar text,
    full_name text,
    phone_number varchar(20) NOT NULL,
    gender enum('male', 'female', 'N/A') NOT NULL,
    birth_date date NOT NULL,
    adrress text,
    email text,
    created_date date NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (phone_number)
);

DROP table IF EXISTS location;

create table location(
    id int NOT NULL AUTO_INCREMENT,
    latitude FLOAT,
    longitude FLOAT,
    user_id int,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES user_table(id)
);

drop table if EXISTS trailler_types;

create table trailler_types(
    id int NOT NULL AUTO_INCREMENT,
    _name VARCHAR(30),
    _desc text,
    _pic text,
    UNIQUE KEY (_name),
    PRIMARY KEY(id)
);

drop table if EXISTS trailler;

create table trailler(
    id int NOT NULL AUTO_INCREMENT,
    _name VARCHAR(30),
    _desc text,
    _pic text,
    UNIQUE KEY (_name),
    PRIMARY KEY(id)
);

drop table if EXISTS vehicle;

create TABLE vehicle(
    id int NOT NULL AUTO_INCREMENT,
    _name VARCHAR(30),
    _desc text,
    _pic text,
    UNIQUE KEY (_name),
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
    vehicle_id int,
    approved BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES user_table(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
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

drop table if EXISTS drivers_trailler;

create Table drivers_trailler(
    id int NOT NULL AUTO_INCREMENT,
    trailer_id int,
    driver_id int,
    FOREIGN KEY (trailer_id) REFERENCES trailler(id),
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
    FOREIGN KEY(viecle_Id) REFERENCES vehicle(id),
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

Drop Table if EXISTS balance;

CREATE TABLE balance(
    id int not null AUTO_INCREMENT,
    user_id int,
    amount DECIMAL(13, 4),
    FOREIGN KEY(user_id) REFERENCES user_table(id),
    PRIMARY KEY(id)
);

Drop Table if EXISTS balance_transactions;

CREATE TABLE balance_transactions(
    id int not null AUTO_INCREMENT,
    user_id int,
    balance_id int,
    amount FLOAT,
    transactions_type TEXT,
    FOREIGN KEY(user_id) REFERENCES user_table(id),
    FOREIGN KEY(balance_id) REFERENCES balance(id),
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS inbox;

CREATE TABLE inbox (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    receiverId int NOT NULL,
    Hash varchar(100) DEFAULT NULL,
    lastMessage varchar(120) DEFAULT NULL,
    seen tinyint(1) DEFAULT NULL,
    unseenNumber int DEFAULT NULL,
    deleted_id int DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (Hash),
    FOREIGN KEY (deleted_id) REFERENCES user_table (id),
    FOREIGN KEY (receiverId) REFERENCES user_table (id),
    FOREIGN KEY (user_id) REFERENCES user_table (id)
);

DROP TABLE IF EXISTS message;

CREATE TABLE message (
    id int NOT NULL AUTO_INCREMENT,
    sendTime datetime DEFAULT NULL,
    readTime datetime DEFAULT NULL,
    contentImage text,
    contentText text,
    contentAudio text,
    SenderId int NOT NULL,
    Delete_id int DEFAULT NULL,
    Hash_id varchar(120) NOT NULL,
    CallsDuration int DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (Delete_id) REFERENCES user_table (id),
    FOREIGN KEY (Hash_id) REFERENCES inbox(Hash),
    FOREIGN KEY (SenderId) REFERENCES user_table(id)
);

--------------------------------------------------------------------------------
-- ---------------Drop All Tables----------------------------
DROP TABLE IF EXISTS message;

DROP TABLE IF EXISTS inbox;

Drop Table if EXISTS balance_transactions;

Drop Table if EXISTS balance;

DROP TABLE if EXISTS Reviews;

DROP TABLE if EXISTS Ticket;

drop table if EXISTS OrderTable;

drop table if EXISTS drivers_trailler;

drop table if EXISTS drivers_trailler_type;

DROP table IF EXISTS driver;

drop table if EXISTS vehicle;

drop table if EXISTS trailler;

drop table if EXISTS trailler_types;

DROP table IF EXISTS user_table;

DROP table IF EXISTS location;

-- ---------------Drop All Tables----------------------------
DELIMITER;

;

CREATE PROCEDURE `SendMesage`(
    ContentImage text,
    ContentText text,
    ContentAudio text,
    _SenderId int,
    _receiverId int,
    _HASH varchar(120),
    Duration int
) begin DECLARE Hash_id VARCHAR(60);

if(_HASH = "") then
select
    concat("if", _HASH);

if(
    exists(
        select
            `Hash`
        from
            inbox
        where
            (
                user_id = _SenderId
                or receiverId = _SenderId
            )
            and (
                user_id = _receiverId
                or receiverId = _receiverId
            )
    )
) then
select
    @Hash_id := `Hash`
from
    inbox
where
    user_id = _SenderId
    or receiverId = _SenderId;

update
    inbox
set
    lastMessage = ContentText,
    unseenNumber = unseenNumber + 1
where
    `Hash` = @Hash_id;

select
    Concat('data ', @Hash_id);

else
insert into
    inbox(
        user_id,
        receiverId,
        Hash,
        lastMessage,
        seen,
        unseenNumber,
        deleted_id
    )
values
    (
        _SenderId,
        _receiverId,
        CONCAT(_SenderId, "-", _receiverId, "-", now()),
        ContentText,
        false,
        10,
        null
    );

set
    @Hash_id := CONCAT(_SenderId, "-", _receiverId, "-", now());

select
    Concat('else data ', Hash_id);

end if;

else
select
    concat("else", _HASH);

select
    @Hash_id := _HASH;

update
    inbox
set
    lastMessage = ContentText,
    unseenNumber = unseenNumber + 1
where
    `Hash` = _HASH;

end if;

insert into
    message (
        sendTime,
        readTime,
        contentImage,
        contentText,
        contentAudio,
        giftCoins,
        SenderId,
        Delete_id,
        Hash_id,
        CallsDuration
    )
values
    (
        now(),
        null,
        ContentImage,
        ContentText,
        ContentAudio,
        giftnumber,
        _SenderId,
        null,
        @Hash_id,
        Duration
    );

END;

;

DELIMITER;