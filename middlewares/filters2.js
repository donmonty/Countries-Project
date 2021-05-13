const { Op } = require("sequelize");
const models = require('../database/models');

const order = [['name', 'ASC']];
const name = false;
const continent = false
const activity = 'Ski'


function queryBuilder() {

  let okQuery;

  const queryOptions = {
    include: [{
      model: models.Activity
    }],
    order: order,
    limit: 10
    // offset: startIndex,
    // limit: endIndex,
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

(async function filter() {
  const records = await models.Country.findAll(correctQuery);

  console.log("RECORDS: ", records);
})();


// (async function filter() {
//   const records = await models.Country.findAll({
//     //attributes: ['id', 'name'],
//     where: {
//       continent: 'Americas'
//     },
//     include: [{
//       model: models.Activity,
//       //attributes: ['name'],
//       where: {
//         name: 'Soccer'
//       }
//     }],
//     order: [['name', 'ASC']]
//   });

//   console.log("RECORDS: ", records);
// })();