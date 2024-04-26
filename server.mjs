import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import fs from 'fs'

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

// ?debug console.log(global.localStorage.getItem("userName"))

app.set('view engine', 'ejs');

app.get('/', urlencodedParser, async (req, res) => {
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users;')
  
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
        
      
        let data = {
            username: global.localStorage.getItem('userName'),
            tag: global.localStorage.getItem("userKey")
        }

       

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
        const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', userkey);
        

        
        if (users.length != 0) {
            const user = users[0];
            if (user.userPassword == password) {


                let chatarray = user.chats.split(';')
                let currentchats = []
                for (let el of chatarray) {
                    let chat = await db.all('SELECT * FROM Directs WHERE Identifier = (?)', +el)
                    chat.length == 0 ? {} : currentchats.push(chat[0])
                }

                

                var chatstring = ''

                for (let el of currentchats) {
                    let name = ''
                    el.Initiate == user.userName ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }

                let data = {
                    username: user.userName,
                    tag: userkey,
                    chats: chatstring
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

app.post('/openchat/:chatID', urlencodedParser, async (req, res) => {
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', global.localStorage.getItem('userKey'));
        

        
        if (users.length != 0) {
            const user = users[0];
            


                let chatarray = user.chats.split(';')
                let currentchats = []
                for (let el of chatarray) {
                    let chat = await db.all('SELECT * FROM Directs WHERE Identifier = (?)', +el)
                    chat.length == 0 ? {} : currentchats.push(chat[0])
                }

                

                var chatstring = ''

                for (let el of currentchats) {
                    let name = ''
                    el.Initiate == user.userName ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }
                
            
        }

    var chatID = req.params.chatID;
    var chatdata = JSON.parse(fs.readFileSync(path.join(__dirname + `/private/dm/${chatID}.json`)));
   
    if (req.body.newmessage != '') {
        chatdata.messages.push({
            "sender": global.localStorage.getItem('userName'),
            "time": "undefined",
            "text": req.body.newmessage,
            "reactions": "none",
            "status": "received"
        })

        fs.writeFileSync(path.join(__dirname + `/private/dm/${chatID}.json`), JSON.stringify(chatdata));
        chatdata = JSON.parse(fs.readFileSync(path.join(__dirname + `/private/dm/${chatID}.json`)));

    }


    
    let msgs = '';
    for (let message of chatdata.messages) {
        msgs += `<msg class="inter"><i style="font-size:60%;color:lightgray;">${message.sender}: &nbsp;</i>${message.text}</msg>`;
    }

    let data = {
        username: global.localStorage.getItem('userName'),
        tag: global.localStorage.getItem('userKey'),
        messages: msgs,
        chats: chatstring
    }

    res.render('main', {
        userData: data

    });
    
});

const setup = async () => {
    const db = await dbPromise;
    await db.migrate();
    app.listen(5500, () => {
        console.log('Listening on port 5500...')
    })

}


setup()