const { Op } = require("sequelize");
const models = require('../database/models');


function filterCountries() {
  return async (req, res, next) => {

    let { name, continent, activity, order, page, limit } = req.query;

    console.log("Pagination REQ QUERY", req.query);
    //let page;
    //let limit;

    // If no page or lmit values are given, assume
    // page=1 and limit=10
    if (!req.query.page || !req.query.limit) {
      page = 1;
      limit = 10;
    } else {
      page = parseInt(req.query.page);
      limit = parseInt(req.query.limit);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    const { count } = await models.Country.findAndCountAll();

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


    //////////////////////////////////////////////////
    if (!order) order = [['name', 'ASC']];
    if (order === 'popUp') order = [['population', 'ASC']];
    if (order === 'popDown') order = [['population', 'DESC']];
    if (order === 'nameUp') order = [['name', 'ASC']];
    if (order === 'nameDown') order = [['name', 'DESC']];

    ///////// QUERY BUILDER ///////////////////////////
    function queryBuilder() {

      let okQuery;
    
      const queryOptions = {
        include: [{
          model: models.Activity
        }],
        order: order,
        offset: startIndex,
        limit: endIndex,
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

    const correctQuery = queryBuilder();

    try {
      results.results = await models.Country.findAndCountAll(correctQuery);

      if (results.results.count === 0) return res.status(404).json({ message: 'No matches found!'});

      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }


  }
}

module.exports = filterCountries;



