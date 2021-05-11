module.exports = (sequelize, DataTypes) => {
  const CountryActivity = sequelize.define('CountryActivity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    CountryId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Country'
      }
    },
    ActivityId: {
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Activity'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, { tableName: 'country_activity' });

  
  return CountryActivity;
}