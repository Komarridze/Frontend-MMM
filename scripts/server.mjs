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
//             maxLength: 21,
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, '/../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../templates/login.html'))
    console.log('ajaja')
})

app.get('../templates/login.html', (req, res) => {
    var username = req.body.username;
    var bio = req.body.bio;
    var password = req.body.password;
    console.log(username, bio, password)
    res.sendFile('../templates/main.html')
})

app.listen(5500, () => {
    console.log('Listening on port 5500...')
})