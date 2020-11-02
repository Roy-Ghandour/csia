const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "csia",
    password: "csia",
    database: "test"
});

con.connect((err) => {
    console.log("Connecting to database");
    if (!err) {
        console.log("Connection successful");
    } else {
        throw err;
        console.log("Unable to connect");
    }
});

module.exports = con;
