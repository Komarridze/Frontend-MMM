import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import fs from 'fs'
import {Server} from 'socket.io'
import {createServer} from 'node:http'


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
import {Router} from 'express'
import session from 'express-session'
import request from 'request'
import { channel } from 'diagnostics_channel'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}))

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});

const server = createServer(app)
const router = Router()

const io = new Server(server)

io.on('connection', (socket) => {
    socket.on('newmessage', (value, tag) => {
        
        io.emit('interconnect', value, tag)

    })
})

// >> TO home

// ?debug console.log(global.localStorage.getItem("userName"))

app.set('view engine', 'ejs');

app.get('/', urlencodedParser, async (req, res) => {
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users;')
    console.log(req.session.loggedin)
    if (req.session.loggedin != true)
    res.sendFile(path.join(__dirname + '/templates/login.html'))
    else{
        var userkey = req.session.userKey;

        const db = await dbPromise;
        const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', userkey);
        

        
        if (users.length != 0) {
            const user = users[0];

                // SECTION - Post to main (groups)
                let chatarray = user.chats.split(';')
                let currentchats = []
                for (let el of chatarray) {
                    let chat = await db.all('SELECT * FROM Directs WHERE Identifier = (?)', +el)
                    chat.length == 0 ? {} : currentchats.push(chat[0])
                }

                

                var chatstring = ''

                for (let el of currentchats) {
                    let name = ''
                    el.Initiate == user.userKey ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }

                // SECTION - Post to main (channels)

                let channelarray = user.channels.split(';')
                let currentchannels = []
                for (let el of channelarray) {
                    let channel = await db.all('SELECT * FROM Channels WHERE Identifier = (?)', +el)
                    channel.length == 0 ? {} : currentchannels.push(channel[0])
                }

                var channelstring = ''
                
                for (let el of currentchannels) {
                    let name = ''
                    for (let i = 0; i < (el.Name.split(' ').length > 3 ? 3 : el.Name.split(' ').length); i++) {
                        name += el.Name.split(' ')[i][0]
                    }

                    channelstring += `<chn class="inter" onclick="connectChannel(${el.Identifier})">${name}</chn>`
                }

                    
                let data = {
                    username: user.userName,
                    tag: userkey,
                    chats: chatstring,
                    channels: channelstring,
                    branch: ':main'
                }

                
                

                res.render('main', {
                    userData: data

                });

            

    
}}});

// >> TO main

app.get('/main', urlencodedParser, async (req, res) => {
    if (req.session.loggedin == true) {
        
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

        
        

        req.session.username = username
        req.session.userkey = tag
    


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
            req.session.loggedin = true

            await db.run('INSERT INTO Users (userKey, userName, userBio, userPassword, chats) VALUES (?, ?, ?, ?, ?)', tag, username, bio, password, '0;')



            res.render('main', {
                userData: data

            });
    
        }
        }

        

        
        

    } 
    
    else if (req.body.state == 'login') {
        var userkey = req.body.userKey;
        var password = req.body.userPassword;

        const db = await dbPromise;
        const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', userkey);
        

        
        if (users.length != 0) {
            const user = users[0];
            if (user.userPassword == password) {

                // SECTION - Post to main (groups)
                let chatarray = user.chats.split(';')
                let currentchats = []
                for (let el of chatarray) {
                    let chat = await db.all('SELECT * FROM Directs WHERE Identifier = (?)', +el)
                    chat.length == 0 ? {} : currentchats.push(chat[0])
                }

                

                var chatstring = ''

                for (let el of currentchats) {
                    let name = ''
                    el.Initiate == user.userKey ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }

                // SECTION - Post to main (channels)

                let channelarray = user.channels.split(';')
                let currentchannels = []
                for (let el of channelarray) {
                    let channel = await db.all('SELECT * FROM Channels WHERE Identifier = (?)', +el)
                    channel.length == 0 ? {} : currentchannels.push(channel[0])
                }

                var channelstring = ''
                
                for (let el of currentchannels) {
                    let name = ''
                    for (let i = 0; i < (el.Name.split(' ').length > 3 ? 3 : el.Name.split(' ').length); i++) {
                        name += el.Name.split(' ')[i][0]
                    }

                    channelstring += `<chn class="inter" onclick="connectChannel(${el.Identifier})">${name}</chn>`
                }

                    
                let data = {
                    username: user.userName,
                    tag: userkey,
                    chats: chatstring,
                    channels: channelstring,
                    branch: ':main'
                }

                req.session.username = user.userName;
                req.session.userkey = user.userKey;
                req.session.loggedin = true;

                

                res.render('main', {
                    userData: data

                });

            }
        }
        else {res.sendFile(path.join(__dirname + '/templates/login.html'))}
        
    }
    else {res.sendFile(path.join(__dirname + '/templates/login.html'))}
        
    
    
 
    //! password.toLowerCase()

    
    
})

app.get('/openchat/:chatID', urlencodedParser, async (req, res) => {
    if (req.session.loggedin == true) {
        
        const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', req.session.userkey);
        

        
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
                    el.Initiate == user.userKey ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }
                
                let channelarray = user.channels.split(';')
                let currentchannels = []
                for (let el of channelarray) {
                    let channel = await db.all('SELECT * FROM Channels WHERE Identifier = (?)', +el)
                    channel.length == 0 ? {} : currentchannels.push(channel[0])
                }

                var channelstring = ''
                
                for (let el of currentchannels) {
                    let name = ''
                    for (let i = 0; i < (el.Name.split(' ').length > 3 ? 3 : el.Name.split(' ').length); i++) {
                        name += el.Name.split(' ')[i][0]
                    }

                    channelstring += `<chn class="inter" onclick="connectChannel(${el.Identifier})">${name}</chn>`
                }

               
        }
      
        let data = {
            username: req.session.username,
            tag: req.session.userkey,
            chats: chatstring,
            channels: channelstring,
            branch: ':main'
        }

    

        res.render('main', {
            userData: data
        });

        

    }
    else
    res.sendFile(path.join(__dirname + '/templates/login.html'));
})

app.post('/openchat/:chatID', urlencodedParser, async (req, res) => {
    
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', req.session.userkey);
        

        
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
                    el.Initiate == user.userKey ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }

                let channelarray = user.channels.split(';')
                let currentchannels = []
                for (let el of channelarray) {
                    let channel = await db.all('SELECT * FROM Channels WHERE Identifier = (?)', +el)
                    channel.length == 0 ? {} : currentchannels.push(channel[0])
                }

                var channelstring = ''
                
                for (let el of currentchannels) {
                    let name = ''
                    for (let i = 0; i < (el.Name.split(' ').length > 3 ? 3 : el.Name.split(' ').length); i++) {
                        name += el.Name.split(' ')[i][0]
                    }

                    channelstring += `<chn class="inter" onclick="connectChannel(${el.Identifier})">${name}</chn>`
                }

                    
            
                
            
        }

    var chatID = req.params.chatID;
    var chatdata = JSON.parse(fs.readFileSync(path.join(__dirname + `/private/dm/${chatID}.json`)));
   
    if (req.body.newmessage != '') {
        chatdata.messages.push({
            "sender": req.session.userkey,
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
        msgs += `<msg class="inter"><i>${message.sender}: &nbsp;</i>${message.text}</msg>`;
    }

    let data = {
        username: req.session.username,
        tag: req.session.userkey,
        messages: msgs,
        chats: chatstring,
        channels: channelstring,
        branch: (chatdata.initiate == req.session.userkey ? chatdata.receiver : chatdata.initiate)
    }

    // console.log(data)
    

    res.render('main', {
        userData: data

    });

    
});

app.get('/openchannel/:chnID', urlencodedParser, async (req, res) => {
    if (req.session.loggedin == true) {
        
        const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', req.session.userkey);
        

        
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
                    el.Initiate == user.userKey ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }
                
                let channelarray = user.channels.split(';')
                let currentchannels = []
                for (let el of channelarray) {
                    let channel = await db.all('SELECT * FROM Channels WHERE Identifier = (?)', +el)
                    channel.length == 0 ? {} : currentchannels.push(channel[0])
                }

                var channelstring = ''
                
                for (let el of currentchannels) {
                    let name = ''
                    for (let i = 0; i < (el.Name.split(' ').length > 3 ? 3 : el.Name.split(' ').length); i++) {
                        name += el.Name.split(' ')[i][0]
                    }

                    channelstring += `<chn class="inter" onclick="connectChannel(${el.Identifier})">${name}</chn>`
                }

               
        }
      
        let data = {
            username: req.session.username,
            tag: req.session.userkey,
            chats: chatstring,
            channels: channelstring,
            branch: ':main'
        }

    

        res.render('main', {
            userData: data
        });

        

    }
    else
    res.sendFile(path.join(__dirname + '/templates/login.html'));
})

app.post('/openchannel/:chnID', urlencodedParser, async (req, res) => {
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM Users WHERE userKey = (?);', req.session.userkey);
        

        
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
                    el.Initiate == user.userKey ? name = el.Receiver : name = el.Initiate;
                    chatstring += `<group class="inter" onclick="connectChat(${el.Identifier})">${name}</group>`
                }

                let channelarray = user.channels.split(';')
                let currentchannels = []
                for (let el of channelarray) {
                    let channel = await db.all('SELECT * FROM Channels WHERE Identifier = (?)', +el)
                    channel.length == 0 ? {} : currentchannels.push(channel[0])
                }

                var channelstring = ''
                

                for (let el of currentchannels) {
                    let name = ''
                    for (let i = 0; i < (el.Name.split(' ').length > 3 ? 3 : el.Name.split(' ').length); i++) {
                        name += el.Name.split(' ')[i][0]
                    }

                    channelstring += `<chn class="inter" onclick="connectChannel(${el.Identifier})">${name}</chn>`
                }

                    
            
                
            
        }

    var chnID = req.params.chnID;
    var chatdata = JSON.parse(fs.readFileSync(path.join(__dirname + `/private/channels/${chnID}.json`)));
    
    if (req.body.newmessage != '') {
        chatdata.messages.push({
            "sender": req.session.userkey,
            "time": "undefined",
            "text": req.body.newmessage,
            "reactions": "none",
            "status": "received"
        })

        fs.writeFileSync(path.join(__dirname + `/private/channels/${chnID}.json`), JSON.stringify(chatdata));
        chatdata = JSON.parse(fs.readFileSync(path.join(__dirname + `/private/channels/${chnID}.json`)));

    }


    
    let msgs = '';
    for (let message of chatdata.messages) {
        msgs += `<msg class="inter"><i>${message.sender}: &nbsp;</i>${message.text}</msg>`;
    }

    let data = {
        username: req.session.username,
        tag: req.session.userkey,
        messages: msgs,
        chats: chatstring,
        channels: channelstring,
        branch: chatdata.name
    }


    

    res.render('main', {
        userData: data

    });

    
});

const setup = async () => {
    const db = await dbPromise;
    await db.migrate();
    server.listen(5500, () => {
        console.log('Listening on port 5500...')
    })

}


setup()