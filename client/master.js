//Enables debugging messages in the console
let debug = false;


//Sends query to databse and returns output
    //Input query is a string containing an SQL statement
async function get(query) {
    //Logging the query to the console for bugfixing and admin purposes
    if (debug) {
        console.log("Sending query: ");
        console.log(query);
        console.log("---------------");
    }

    //Using the fetch method to send an HTTP request to the node.js server
    await fetch('http://localhost:3000/db', {
        //Object specifiying the parameters of the request:
            //HTTP request method is POST to enable both sending and recieving of data
            //Content type is specified as json so that the data cxan be easily processed
        method: "POST",
        headers: {"Content-Type": "application/json"},

        //Passing the query string as a json object
        body: JSON.stringify({message: query})
    }   //Processing the json response to extract the query result
    ).then(res => res.json())
    .then((data) => output = data.message);

    //Outputting the query result and reporting to the console for bugfixing and admin
    if (debug) console.log("Query successful");
    return output;
}

function check() {
    if (sessionStorage.getItem('user') === null) {
        document.getElementById('ordertab').href = "signin.html";
    }
}
