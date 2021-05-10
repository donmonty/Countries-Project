
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    difficulty: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    season: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, { tableName: 'Activity' });

  Activity.associate = function(models) {
    Activity.belongsToMany(models.Country, { through: 'CountryActivity' })
  }
  return Activity;
}