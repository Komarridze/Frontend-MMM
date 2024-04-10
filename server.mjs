// import { addRxPlugin } from 'rxdb';
// import { RxDBDevModePlugin, disableWarnings } from 'rxdb/plugins/dev-mode';
// addRxPlugin(RxDBDevModePlugin);

// disableWarnings()

// import { createRxDatabase } from 'rxdb';
// import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

// const kaktusdb = await createRxDatabase({
//   name: 'kaktus',
//   storage: getRxStorageDexie()
// });

// const userSchema = {
//     version: 0,
//     primaryKey: 'userkey',
//     type: 'object',
//     properties: {
//         id: {
//             type: 'integer',
//             maxLength: 20 // <- the primary key must have set maxLength
//         },
//         username: {
//             type: 'string',
//             maxLength: 20,
//         },
//         userkey: {
//             type: 'string',
//             maxLength: 9,
//         },
//         bio: {
//             type: 'string',
//             maxLength: 100,
//         },
//         password: {
//             type: 'string',
//             maxLength:15
//         }
//     },
//     required: ['id', 'username', 'userkey', 'password']
// }

// await kaktusdb.addCollections({
//     todos: {
//       schema: userSchema
//     }
//   });

// const initiate = await kaktusdb.todos.insert({
//     id: 0,
//     username: 'Tretitz',
//     userkey: '@tretitz',
//     password: 'hueta151'
// });




// >> Server

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const upperCase= new RegExp('[A-Z]');
const lowerCase= new RegExp('^[a-z]');
const numbers = new RegExp('[0-9]');

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});

app.use(express.static(path.join(__dirname, '/public')));


app.get('/', urlencodedParser, (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/login.html'))
})

app.post('/main', urlencodedParser, (req, res) => {
    var username = req.body.userName;
    var bio = req.body.userBio;
    var password = req.body.userPassword;
    // ? console.log(req.body)

    if (!(username.match(/\W/)) &&
    (password.toLowerCase().match(lowerCase) &&  password.toLowerCase().match(numbers))
    )  
    {
    res.sendFile(path.join(__dirname + '/templates/main.html'))
    }

    
    else {
        res.sendFile(path.join(__dirname + '/templates/login.html'))
    } 
 
  


    
})

app.listen(5500, () => {
    console.log('Listening on port 5500...')
})

// function unsupportedChar() {
//     window.alert(`Ім'я користувача і пароль не можуть включати символи /, ", ', =, + та пробіли`);
// }