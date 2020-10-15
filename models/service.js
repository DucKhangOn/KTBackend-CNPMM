'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    fee: DataTypes.DOUBLE
  }, {});
  Service.associate = function (models) {
    Service.hasMany(models.Transaction);
  };
  return Service;
};


