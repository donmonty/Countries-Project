const axios = require('axios');
const fs = require('fs');

(async function getCountryData() {
  let data;
  try {
    const response = await axios.get("https://restcountries.eu/rest/v2/all");
    data = response.data;
  } catch(err) {
    console.log("Connection API error: ", err);
  }

  // Write to JSON file
  const jsonString = JSON.stringify(data);
  fs.writeFile(__dirname + "/countryData.json", jsonString, err => {
    if (!err) return console.log("Country data file created successfully!");
    console.log('Error writing to country data file!', err);
  })
})();