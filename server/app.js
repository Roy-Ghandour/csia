const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

app.listen(port, (err) => {
    if (err) throw err;
    console.log("Listening on port " + port);
});

const db = require('./dbconnector');

app.post('/db', (req, res) => {
    console.log("Recieved a Query");
    let query = req.body.message;

    db.query(query, (err, rows, fields) => {
        if (err) throw err;
        res.json({message: rows});
    });
});

/* Home page for server, might be able to use for admin if necissary
app.get('', (req, res) => {
    res.send('Hello world!');
});
*/
