const { error } = require('console');

const sqlite3 = require('sqlite3').verbose();

let mdb = new sqlite3.Database('maindata.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('\x1b[36m%s\x1b[0m', '[>] DB connection established and secured.')
});


// >> BODY FUNCTIONS
function query(target, table, filterName, filter) {
    mdb.all(`SELECT ${target} FROM ${table} WHERE ${filterName} = ${filter}`, (error, rows) => {
        console.log(rows)
    });
}

function queryUser(target) {
    mdb.all(`SELECT * FROM Users WHERE UserKey = '${target}' LIMIT 1`, (error, rows) => {
        // ? console.log(rows);
        rows.forEach(row => console.log(`${row.UserName} ${row.UserID}`))
    });
}

function verifyPassword(target, password) {
    mdb.all(`SELECT * FROM Users WHERE UserKey = '${target}' LIMIT 1`, (error, rows) => {
        // ? console.log(rows);
        rows.forEach(function (row) {
            if (row.PassKey == password) {
                console.log("\u001b[38;5;147m" + `[&] Logged in as ${target}.` + "\u001b[0m")
            }
            else {
                console.log("\u001b[31m" + '[x] Incorrect password.' + "\u001b[0m")
            }
        })
    });

}

// ! queryUser('<user>');
// ! verifyPassword('<user>', '<passkey>');


// >> Close DB
mdb.close((err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('\x1b[36m%s\x1b[0m', '[x] Closed database connection.')
})