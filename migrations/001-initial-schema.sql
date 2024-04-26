-- Up

CREATE TABLE Users (
    userKey      TEXT (9)   PRIMARY KEY
                            UNIQUE
                            NOT NULL,
    userName     TEXT (15)  NOT NULL,
    userBio      TEXT (100),
    userPassword TEXT (15)  NOT NULL,
    chats        TEXT
);

CREATE TABLE Directs (
    Identifier NUMERIC (20) PRIMARY KEY DESC,
    Initiate   TEXT (15)    REFERENCES Users (userKey),
    Receiver   TEXT (15)    REFERENCES Users (userKey) 
);




-- Down

DROP TABLE Users;
DROP TABLE Directs;