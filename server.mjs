import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

const dbPromise = open({
    filename: "data.db",
    driver: sqlite3.Database
})

// >> Server


import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'
import 'localstorage-polyfill'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});



    
// >> TO home

console.log(global.localStorage.getItem("userName"))

app.set('view engine', 'ejs');

app.get('/', urlencodedParser, async (req, res) => {
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users;')
    console.log(users)
    if (global.localStorage.getItem("loggedin") != 'true')
    res.sendFile(path.join(__dirname + '/templates/login.html'))
    else{
    let data = {
        username: global.localStorage.getItem('userName'),
        tag: global.localStorage.getItem("userKey")
    }



    res.render('main', {
        userData: data

    });
}
    
})

// >> TO main

app.get('/main', urlencodedParser, (req, res) => {
    if (global.localStorage.getItem("loggedin") == 'true') {
        
        console.log(global.localStorage.getItem("userName"))
        let data = {
            username: global.localStorage.getItem('userName'),
            tag: global.localStorage.getItem("userKey")
        }

        console.log(data)

        res.render('main', {
            userData: data
        });

    }
    else
    res.sendFile(path.join(__dirname + '/templates/login.html'));
    
    
    

});

app.post('/main', urlencodedParser, async (req, res) => {
    if (req.body.state == 'signin') {

        var username = req.body.userName;
        var bio = req.body.userBio;
        var password = req.body.userPassword;
        var tag = req.body.userTag;

        
        

        global.localStorage.setItem("userName", username);
        global.localStorage.setItem("userKey", tag);
        console.log(req.body)

        let data = {
            username: username,
            tag: tag
        }

        const db = await dbPromise;
        const usersSameKey = await db.all('SELECT * FROM Users WHERE userKey = (?);', tag);

        if (usersSameKey.length == 0) {

            if (!(username.match(/\W/)) &&
        (!(password.match(/\W/))) && (username != "") && (password != ""))  

        {
            global.localStorage.setItem("loggedin", true);

            await db.run('INSERT INTO Users (userKey, userName, userBio, userPassword) VALUES (?, ?, ?, ?)', tag, username, bio, password)

            res.render('main', {
                userData: data

            });
    
        }
        }

        

        else {
            res.sendFile(path.join(__dirname + '/templates/login.html'))
        } 
        

    }
    
    if (req.body.state == 'login') {
        var userkey = req.body.userKey;
        var password = req.body.userPassword;

        const db = await dbPromise;
        const users = await db.all('SELECT * FROM Users;');
        

        
        if (users.length != 0) {
            const user = users[0];
            if (
                user.userPassword == password

            ) {

                let data = {
                    username: user.userName,
                    tag: userkey
                }

                global.localStorage.setItem("loggedin", true);
                global.localStorage.setItem("userName", user.userName);
                global.localStorage.setItem("userKey", userkey);

                res.render('main', {
                    userData: data

                });

            }

            else {res.sendFile(path.join(__dirname + '/templates/login.html'))}
        }

        else {res.sendFile(path.join(__dirname + '/templates/login.html'))}
        
    }
    
 
    //! password.toLowerCase()

    
    
})

const setup = async () => {
    const db = await dbPromise;
    await db.migrate();
    app.listen(5500, () => {
        console.log('Listening on port 5500...')
    })

}


setup()