const { Op } = require("sequelize");
const models = require('../database/models');


function filterCountries() {
  return async (req, res, next) => {

    let { name, continent, activity, order, page, limit } = req.query;

    // console.log('////////////////////////////////////////////')
    // console.log('////////////////////////////////////////////')
    // console.log("Pagination REQ QUERY", req.query);
    //if (!name) console.log('Name cuenta como null');
    

    // If no page or lmit values are given, assume
    // page=1 and limit=10
    if (!req.query.page && req.query.limit) {
      page = 1;
      limit = parseInt(req.query.limit);
    } else if (req.query.page && !req.query.limit) {
      limit = 10;
      page = parseInt(req.query.page);
    } else if (!req.query.page && !req.query.limit) {
      page = 1;
      limit = 10;
    } else {
      page = parseInt(req.query.page);
      limit = parseInt(req.query.limit);
    }

    //////////////////////////////////////////////////
    if (!order) order = [['name', 'ASC']];
    if (order === 'popUp') order = [['population', 'ASC']];
    if (order === 'popDown') order = [['population', 'DESC']];
    if (order === 'nameUp') order = [['name', 'ASC']];
    if (order === 'nameDown') order = [['name', 'DESC']];

    ///////// QUERY BUILDER ///////////////////////////
    function queryBuilder(name, continent, activity, order, limit, startIndex) {

      let okQuery;
    
      const queryOptions = {
        include: [{
          model: models.Activity
        }],
        order: order,
        offset: startIndex,
        // limit: endIndex,
        limit: limit
      };
    
      if (name && continent) {
        queryOptions.where = {
          name: {
            [Op.iLike]: `%${name}%`
          },
          continent: continent
        }
      }
      
      if (name && !continent) {
        queryOptions.where = {
          name: {
            [Op.iLike]: `%${name}%`
          }
        }
      }
    
      if (!name && continent) {
        queryOptions.where = {
          continent: continent
        }
      }
    
      if (activity) {
        okQuery = { ...queryOptions, include: [{...queryOptions.include[0], where: { name: activity }}] }
      } else {
        okQuery = { ...queryOptions };
      }
    
      return okQuery;
    }

    /////////////////////////////////////////////////////////
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    let correctQuery = queryBuilder(name, continent, activity, order, limit, startIndex);
    const results = {};

    try {

      results.results = await models.Country.findAndCountAll(correctQuery);
      const count = results.results.count;
      if (count === 0) return res.status(404).json({ message: 'No matches found!'});

      ///////////////////////////////////////////////
      // If the requested page > max pages possible
      // set page to maxPages!
      // We need to run the query again with the updated 
      // startIndex value
      //////////////////////////////////////////////
      const maxPages = Math.ceil(count/limit);
      if (page > maxPages) {
        page = maxPages;

        startIndex = (page - 1) * limit;
        // const endIndex = page * limit;
  
        correctQuery = queryBuilder(name, continent, activity, order, limit, startIndex);
        results.results = await models.Country.findAndCountAll(correctQuery);

        // We set the previous and next pages info
        if (endIndex < count) { // 20 < 250
          results.next = {
            page: page + 1, // 2 + 1 = 3
            limit: limit // 10
          }
        }
    
        if (startIndex > 0) { // 10 > 0
          results.previous = {
            page: page - 1, // 2 - 1 = 1
            limit: limit // 10
          }
        }

        res.paginatedResults = results;
        return next();
      }
      //////////////////////////////////////////////

      // We set the previous and next pages info
      if (endIndex < count) { // 20 < 250
        results.next = {
          page: page + 1, // 2 + 1 = 3
          limit: limit // 10
        }
      }
  
      if (startIndex > 0) { // 10 > 0
        results.previous = {
          page: page - 1, // 2 - 1 = 1
          limit: limit // 10
        }
      }

      res.paginatedResults = results;
      next();

    } catch(error) {
      res.status(500).json({ message: error.message });
    }
    
    

  }
}

module.exports = filterCountries;



