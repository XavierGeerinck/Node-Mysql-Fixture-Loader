# Node-Mysql-Fixture-Loader
## Prerequisites
This is a fixture loader for use with mysql. There are some prerequisites that have to be installed before usage:

    npm install mysql underscore async --save

Also a config file loader is required if you want to use the config.database part as written below, this requires the directory /config with a index.js that loads the config json files.

For more info about the Config File loader you can check out this repository: [https://github.com/thebillkidy/Node-Config-Loader](https://github.com/thebillkidy/Node-Config-Loader)

## Installation
* Drag and drop the util folder to the root directory of your project

## Usage
Include the config as stated in the prerequisites and then load the fixtureLoader with the config keys

JSON for the database part:

    "database": {
        "host": "",
        "port": 0,
        "user": "",
        "password": "",
        "database": ""
    }

JS for the require part:

    var config = require(process.cwd() + '/config');
    var fixtureLoader = require(process.cwd() + '/util/fixtures')(config.database);

After that you can use the following methods:

    fixtureLoader.clear(callback);
    fixtureLoader.loadAll(callback);
    fixtureLoader.load('table');
    fixtureLoader.load(['table1', 'table2']);
    
If you do not want a value in the fixture to be persisted you can also do like this:

    [
        {
            "id": 1,
            "email": "test@test.be",
            "password": "$2a$10$D151BsdIw6vA.LL8CG4m5uypDg.vUwyOTiJKiZOTpgoeXI2B53XjG",
            "dateCreated": "0000-00-00",
            "scope": "user",
            "plain_password": { "persist": false, "value": "tester" }
        }
    ]

This will create a user in the `user` table with the columns: `id, email, password, dateCreated, scope` but it will not persist plain_password. This way you can use the fixture to also get the plain_password to be used in the tests.

P.S. The password in the user fixture is tester ;)
