-- Up

CREATE TABLE Users (
    userKey      TEXT (9)   PRIMARY KEY
                            UNIQUE
                            NOT NULL,
    userName     TEXT (15)  NOT NULL,
    userBio      TEXT (100),
    userPassword TEXT (15)  NOT NULL,
    chats        TEXT       DEFAULT ('0;'),
    channels     TEXT       DEFAULT ('0;') 
);

CREATE TABLE Directs (
    Identifier NUMERIC (20) PRIMARY KEY DESC
                            UNIQUE
                            NOT NULL,
    Initiate   TEXT (15)    REFERENCES Users (userKey),
    Receiver   TEXT (15)    REFERENCES Users (userKey) 
);

CREATE TABLE Channels (
    Identifier NUMERIC   NOT NULL
                         PRIMARY KEY
                         UNIQUE,
    Name       TEXT (20) NOT NULL
);






-- Down

DROP TABLE Users;
DROP TABLE Directs;
DROP TABLE Channels;