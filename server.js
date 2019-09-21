var express = require('express');
var bodyParser = require('body-parser');
var port = 3000;
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

// db.serialize(function () {
//     db.run('CREATE TABLE IF NOT EXISTS Quotes(ID INTEGER PRIMARYKEY, Quote VARCHAR(255), Author VARCHAR(255), Year INTEGER)');
//     db.run('INSERT INTO Quotes VALUES(1, "Me la pelas","Yo mero", 1988)');
// });

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var quotes = [
    {
        id: 1,
        quote: "The best is yet to come",
        author: "Unknown",
        year: 2000
    },
    {
        id: 2,
        quote: "This is a quote",
        author: "First Last",
        year: 1930
    },
    {
        id: 3,
        quote: "This is another quote",
        author: "First2 Last2",
        year: 1910
    }
];

app.listen(port, function () {
    console.log("Listening on port " + port);
});

app.get("/", function (req, res) {
    res.send('This is the main page');

});

app.get('/quotes', function (req, res) {
    console.log("Get a list of all quotes as json");
    if (req.query.year) {
        db.all('SELECT * FROM Quotes WHERE year = ?', [req.query.year], function (err, rows) {
            if (err) {
                console.log("Error: " + err.message);
            } else {
                res.json(rows);
            }
        });
    } else {
        db.all('SELECT * FROM Quotes', function (err, rows) {
            if (err) {
                console.log("Error: " + err.message);
            } else {
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function (req, res) {
    console.log("return quote with the ID: " + req.params.id);
    db.get('SELECT * FROM Quotes WHERE rowid = ?', [req.params.id], function (err, rows) {
        if (err) {
            console.log("Error: " + err.message);
        } else {
            res.json(rows);
        }
    });
});

app.post('/quotes', function (req, res) {
    console.log("Insert a new quote: " + req.body.quote);
   db.run('INSERT INTO Quotes VALUES(?,?,?)', [req.body.quote,req.body.author,req.body.year],function(err){
       if(err){
           console.log("Error: " + err.message);
       }else{
           res.send("Inserted Quote with ID: " + this.lastID);
       }
   });
});