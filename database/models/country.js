
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    continent: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    capital: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subregion: DataTypes.STRING,
    area: DataTypes.INTEGER,
    population: DataTypes.INTEGER,
    flag: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }

  }, { tableName: 'Country' });

  Country.associate = function(models) {
    Country.belongsToMany(models.Activity, { through: 'CountryActivity' })
  }
  return Country;
}