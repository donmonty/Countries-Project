
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
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
  }, { tableName: 'activity' });

  Activity.associate = function(models) {
    Activity.belongsToMany(models.Country, { through: 'CountryActivity' })
  }
  return Activity;
}