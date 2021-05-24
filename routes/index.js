const { Router } = require('express');
const models = require('../database/models');
const filters = require('../middlewares/filters')

const router = Router();


// ROUTES
router.get('/activity', getActivities);
router.post('/activity', createActivity);
router.get('/countries', filters(), getCountries);
router.get('/countries/:code', getCountryById);


///////////// FUNCTIONS //////////////////

///////// GET ALL COUNTRIES /////////////
async function getCountries(req, res) {

  const results = res.paginatedResults;
  res.status(200).json(results);
}

////////// GET COUNTRY BY ID /////////////
async function getCountryById(req, res) {
  const { code } = req.params;

  // Check if param is a valid code, not numeric
  if (!isNaN(code)) return res.status(400).json({ message: 'Invalid code!' });
  if (code.length !== 3) return res.status(400).json({ message: 'Code must be 3 letters long!'});

  // Convert code to uppercase
  const okCode = code.toUpperCase();

  // Fetch country by code
  try {
    const country = await models.Country.findOne({
      where: { code: okCode },
      include: [models.Activity]
    });
    
    // If no country is found:
    if (!country) return res.status(404).json({ message: 'Country not found!' });
    return res.status(200).json({ data: country });

  } catch (error) {
    console.log("//// ERROR", error)
    return res.status(500).json({ message: 'Something went wrong!'});
  }
}

////// CREATE ACTIVITY ////////////
//======================================
async function createActivity(req, res) {
  const { name, difficulty, duration, season, countries } = req.body;

  // Check for required fields
  if (!name) return res.status(400).json({ message: 'Name is required.'});

  // Ceate new activity
  let newActivity;
  try {
    newActivity = await models.Activity.create({
      name,
      difficulty: parseInt(difficulty),
      duration: parseInt(duration),
      season: season.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    });  
  } catch (error) {
    return res.status(500).send(error);
  }

  console.log('////////////////////////////////////')
  console.log("New Activity: ", newActivity);

  // If countries are provided, fecth countries from the DB 
  // and link them to the activity
  if ((countries && countries.length !== 0) && countries[0] !== "") {
    const selectedCountries = [];
  
    try {

      for (let country of countries) {
        let record = await models.Country.findOne({
          //attributes: "id",
          where: { name: country }
        });
        selectedCountries.push(record);
      }

      console.log('////////////////////////////////////')
      console.log("Countries Array: ", selectedCountries);
      // Link activity to countries
      await newActivity.addCountries(selectedCountries);
      // Return response
      return res.status(200).json(newActivity);  
      
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  // Return response
  res.status(200).json(newActivity);
}

////// GET ALL ACTIVITIES ////////////
//======================================
async function getActivities(req, res) {
  try {
    response = await models.Activity.findAll();
    console.log('ACTIVITIES: ', response)
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error);
  }
}



module.exports = router;