import sqlite3 from 'sqlite3'
// const db = new sqlite3.Database(":memory:")

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

app.get('/', urlencodedParser, (req, res) => {
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

app.post('/main', urlencodedParser, (req, res) => {
    if (req.body.state == 'signin') {
    var username = req.body.userName;
    var bio = req.body.userBio;
    var password = req.body.userPassword;
    var tag = req.body.userTag;

    }
    

    global.localStorage.getItem("userName") == null ? global.localStorage.setItem("userName", username) : {};
    global.localStorage.getItem("userKey") == null ? global.localStorage.setItem("userKey", tag) : {};
    console.log(req.body)

    let data = {
        username: username,
        tag: tag
    }

    if (!(username.match(/\W/)) &&
    (!(password.match(/\W/))) && (username != "") && (password != "")
    )  
    {
        global.localStorage.setItem("loggedin", true);
    res.render('main', {
        userData: data

    });
    }

    
    else {
        res.sendFile(path.join(__dirname + '/templates/login.html'))
    } 
 
    //! password.toLowerCase()

    
    
})

app.listen(5500, () => {
    console.log('Listening on port 5500...')
})
