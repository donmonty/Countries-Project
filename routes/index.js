const { Router } = require('express');
const models = require('../database/models');
const paginatedResults = require('../middlewares/pagination');

const router = Router();


// ROUTES
router.get('/countries', paginatedResults(models.Country), getCountries);
router.get('/countries/:code', getCountryById);

///////////// FUNCTIONS //////////////////

// GET ALL COUNTRIES
async function getCountries(req, res) {

  if (!res.paginatedResults) {

    //console.log("::: REQ QUERY :::", req.query)
    const countries = await models.Country.findAll({
      attributes: ['name'],
      limit: 10
    });
    //console.log(countries);
    return res.status(200).json(countries);
  }

  const results = res.paginatedResults;
  res.status(200).json(results);
}

// GET COUNTRY BY ID
function getCountryById(req, res) {
  return;
}

module.exports = router;