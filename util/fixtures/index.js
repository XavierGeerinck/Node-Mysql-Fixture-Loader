'use strict';

var fs = require('fs');
var mysql = require('mysql');
var db = require(process.cwd() + '/util/db');
var async = require('async');

/**
 * Provide the ability to load fixtures in a database
 */
function Fixtures(config) {
    this.config = config;
    this.files = fs.readdirSync('util/fixtures/data');
    this.fixtures = {};

    // Load the fixtures in this.fixtures
    for (var file in this.files) {
        var fixtureName = this.files[file].split('.')[0];
        this.fixtures[fixtureName] = require('./data/' + this.files[file]);
    }

    this.connection = mysql.createConnection(config);
}

// Load a specific fixture, can be array or single
Fixtures.prototype.load = function (params, callback) {
    var loadFixtures = [];

    if (typeof params === 'string') {
        loadFixtures.push(params);
    } else {
        loadFixtures = params;
    }

    var self = this;

    // Load the fixtures in
    async.each(loadFixtures, function (fixture, fixtureCallback) {
        var loadedFixture = self.fixtures[fixture];

        // Insert all the elements, we construct an INSERT INTO based on the keys and the values
        // INSERT INTO user (email, password) VALUES (?, ?, ?)
        for (var object in loadedFixture) {
            var sql = '';

            var values = [];

            // Formulate SQL
            sql += 'INSERT INTO ' + fixture + ' (' + Object.keys(loadedFixture[object]).join(', ') + ')';

            // Remove the last ,
            sql = sql.substring(0, sql.length - 1);

            sql += ') VALUES (';

            // Add value binding
            for (var key in Object.keys(loadedFixture[object])) {
                sql += '?, ';
            }

            // Remove the last ,
            sql = sql.substring(0, sql.length - 2);

            sql += ');';

            // Push Values
            for (var column in loadedFixture[object]) {
                values.push(loadedFixture[object][column]);
            }

            // console.log(sql);

            db.query({
                sql: sql,
                values: values,
                callback: fixtureCallback
            });
        }
    }, function (err) {
        if (err) {
            return callback(err);
        }

        return callback();
    });
};

// Load all fixtures
Fixtures.prototype.loadAll = function (callback) {
    var params = [];

    for (var file in this.files) {
        params.push(this.files[file].split('.')[0]);
    }

    return this.load(params, callback);
};

Fixtures.prototype.clear = function (callback) {
    var self = this;
    async.each(self.files, function (file, fileCallback) {
        var sql = 'SET FOREIGN_KEY_CHECKS = 0; TRUNCATE ' + file.split('.')[0] + '; SET FOREIGN_KEY_CHECKS = 1;';

        // console.log(sql);

        db.query({
            sql: sql,
            callback: fileCallback
        });
    }, function (err) {
        if (err) {
            return callback(err);
        }

        return callback();
    });
};

// Export the object
module.exports = function (config) {
    var fixtures = new Fixtures(config);
    return fixtures;
};
