const { Router } = require('express');
const models = require('../database/models');
const paginatedResults = require('../middlewares/pagination');

const router = Router();


// ROUTES
router.post('/activity', createActivity);
router.get('/countries', paginatedResults(models.Country), getCountries);
router.get('/countries/:code', getCountryById);


///////////// FUNCTIONS //////////////////

///////// GET ALL COUNTRIES /////////////
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

////////// GET COUNTRY BY ID /////////////
function getCountryById(req, res) {
  return;
}

////// CREATE ACTIVITY ////////////
//======================================
async function createActivity(req, res) {
  const { name, difficulty, duration, season, countries } = req.body;

  // Check for required fields
  if (!name || name === '') return res.status(400).json({ message: 'Name is required.'});

  // Fecth countries from the DB for the activity
  const selectedCountries = [];

  try {
    countries.forEach(async country => {
      const record = await models.Country.findOne({
        //attributes: "id",
        where: { name: country }
      });
      selectedCountries.push(record);
    })  
  } catch (error) {
    res.status(500).send(error);
  }
  
  console.log(selectedCountries.dataValues);

  // Ceate new activity
  let newActivity;
  try {
    newActivity = await models.Activity.create({
      name,
      difficulty,
      duration,
      season,
      createdAt: new Date(),
      updatedAt: new Date()
    });  
  } catch (error) {
    res.status(500).send(error);
  }
  
  // Link activity to countries
  await newActivity.addCountries(selectedCountries);

  // Return response
  res.status(200).json({newActivity});
}




module.exports = router;