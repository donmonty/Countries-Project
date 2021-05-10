
function paginateResults(model) {
  return async (req, res, next) => {

    //console.log("Pagination REQ QUERY", req.query);
    let page;
    let limit;

    // If no page or lmit values are given, assume
    // page=1 and limit=10
    if (!req.query.page || !req.query.limit) {
      page = 1;
      limit = 10;
      // console.log("Enter IF: NO REQ QUERY")
      //res.paginatedResults = false;
      // console.log(res.paginatedResults);
      //return next();
    } else {
      page = parseInt(req.query.page);
      limit = parseInt(req.query.limit);
    }


    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    const { count } = await model.findAndCountAll();

    if (endIndex < count) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    try {
      results.results = await model.findAndCountAll({
        offset: startIndex,
        limit: endIndex
      });
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = paginateResults;

////////////////////////////
// const { rows } = Country.findAndCountAll({
//   where: {
//     continent: {
//       [Op.eq]: continent
//     }
//   },
//   offset: startIndex,
//   limit: endIndex
// })

///////////////
// SELECT country.name
// FROM Country
// JOIN CountryActivity ON CountryActivity.countryId = Country.id
// JOIN Activity ON Activity.id = CountryActivity.activityId
// WHERE Country.continent = 'America' AND Activity.name = 'soccer'
// ORDER BY ASC;