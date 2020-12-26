//Importing a mysql object to create the connection
const mysql = require('mysql');

//Passing database credentials as an object to the createConnection method
    //and saving the resultant connection to the con object
const con = mysql.createConnection({
    host: "localhost",
    user: "csia",
    password: "csia",
    database: "CSIA"
});

//Establishing a link to the database using the con object
con.connect((err) => {
    console.log("Connecting to database");

    //Checking and reporting any errors caused during the connection process
    if (!err) {
        console.log("Connection successful");
    } else {
        throw err;
        console.log("Unable to connect");
    }
});

//Exporting the con object for use in other scripts
module.exports = con;
