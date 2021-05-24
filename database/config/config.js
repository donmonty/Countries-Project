require('dotenv').config({ path: __dirname + `/../.env` });

// module.exports = {
//   development: {
//     url: process.env.DEV_DATABASE_URL,
//     dialect: 'postgres',
//   },
//   test: {
//     url: process.env.TEST_DATABASE_URL,
//     dialect: 'postgres',
//   },
//   production: {
//     //url: process.env.DATABASE_URL,
//     //dialect: 'postgres',
//   },
// };


module.exports = {

  "development": {
    "username": "postgres",
    "password": 398845110,
    "database": "countries_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": 398845110,
    "database": "countries_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": 398845110,
    "database": "countries_test",
    "host": "localhost",
    "dialect": "postgres"
  }
}



// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "database_development",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }
