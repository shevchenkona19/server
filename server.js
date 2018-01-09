'use strict';
const express = require('express');
const app = express();
const port = 4000;
const dbHelper = require('./dbHelper');
const parser = require('body-parser');
app.use(parser.json());
const dbClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

function makeConnectionToDb() {
    dbClient.connect(url, function (err, base) {
        if (err) {
            return console.error("Error in connecting to db: " + err)
        }
        console.log("Db online!");
        var db = base.db('workdb');
        initListeners(db);
    });
}

function initListeners(db) {
    app.post("/insertAddress", function (req, res) {
        dbHelper.insertAddress(db, req.body, function (err, result) {
            if (err) {
                res.status(500);
                res.send({error: "Error in inserting"})
            } else {
                res.status(200);
                res.header("Access-Control-Allow-Origin", "*");
                res.json({insertedId:result.insertedId})
            }
        })
    });
    app.get("/getAllAddresses", function (req, res) {
        dbHelper.getAllAddresses(db, function (err, result) {
            if (err) {
                res.status(500);
                res.send({error: "Error in getting list"})
            } else {
                res.status(200);
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "*");
                res.header("Access-Control-Allow-Methods", "*");
                res.json({items:result});
            }
        });
    });
    app.post("/removeAddress", function (req, res) {
        dbHelper.deleteAddress(db, req.body._id, function (err) {
            if (err) {
                res.status(500);
                res.send({error: "Error in deleting address"});
            } else {
                res.status(200);
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "*");
                res.header("Access-Control-Allow-Methods", "*");
                res.send({result: "success"})
            }
        });
    });
    app.options("/*", function (req, res) {
        res.status(200);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.send({});
    })
}

this.startServer = function () {
    app.listen(port, function () {
        console.log("Server is online! Port: " + port);
    });
    makeConnectionToDb();
};
