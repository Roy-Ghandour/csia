const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

//Setting the port for the sever to listen for requests on
const port = 3000;

//Setting the node.js app to listen on the specified port
app.listen(port, (err) => {
    if (err) throw err;
    console.log("Listening on port " + port);
});

//Initalizing the db (database) object for later use
const db = require('./dbconnector');

//Creating a route to trigger the passing of a query to the databse
app.post('/db', (req, res) => {
    console.log("Recieved a Query");

    //Saving the contents of the POST request body into the query variable
    let query = req.body.message;

    //Passing the query varibable into the query method of the db object
    db.query(query, (err, rows, fields) => {
        if (err) throw err;

        //Storing the result of the SQL query into the res object to be
            //sent back to the origin of the request
        res.json({message: rows});
    });
});

/* Home page for server, might be able to use for admin if necissary
app.get('', (req, res) => {
    res.send('Hello world!');
});
*/
