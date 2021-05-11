'use strict';

const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data;
    const fileContents = fs.readFileSync('countryData.json', 'utf8');

    try {
      data = JSON.parse(fileContents);
    } catch(err) {
      console.log('Error parsing countries JSON data!', err);
    }

    const countriesArray = []; 
    data.forEach(country => {
      countriesArray.push({
        name: country.name,
        continent: country.region,
        code: country.alpha3Code,
        capital: country.capital,
        subregion: country.region,
        area: country.area,
        population: country.population,
        flag: country.flag,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })

    await queryInterface.bulkInsert('country', countriesArray);
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('country', null);
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

