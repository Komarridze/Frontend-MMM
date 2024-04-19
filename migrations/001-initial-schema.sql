-- Up

CREATE TABLE Users (
    userKey      TEXT (9)   PRIMARY KEY
                            UNIQUE
                            NOT NULL,
    userName     TEXT (15)  NOT NULL,
    userBio      TEXT (100),
    userPassword TEXT (15)  NOT NULL
);



-- Down

DROP TABLE Users;