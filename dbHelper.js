'use strict';
const mainCollection = 'addresses';
const mongodb = require('mongodb');

this.insertAddress = function (db, address, callback) {
    db.collection(mainCollection).insertOne(address, function (err, res) {
        callback(err, res);
    })
};

this.getAllAddresses = function (db, callback) {
    db.collection(mainCollection).find({}).toArray(function (err, res) {
        if (err) {
            callback(err);
            return
        }
        callback(err, res)
    })
};

this.deleteAddress = function (db, id, callback) {
    db.collection(mainCollection).deleteOne({_id: new mongodb.ObjectID(id)}, function (err) {
        if (err) {
            callback(err)
        } else {
            callback()
        }
    })
};
