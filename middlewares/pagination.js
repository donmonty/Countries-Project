const { Op } = require("sequelize");

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

    // if 'name' is given in querystring, perform a search by name
    if (req.query.name) {
      const countryName = req.query.name;
      try {
        results.results = await model.findAndCountAll({
          offset: startIndex,
          limit: endIndex,
          where: {
            name: {
              [Op.like]: `%${countryName}%`
            }
          }
        });

        // If no matches are found, return appropriate message
        if (results.results.count === 0) return res.status(404).json({ message: 'No matches found!'});

        res.paginatedResults = results;
        next();
      } catch (error) {
        return res.status(500).json({ message: error.message });
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
