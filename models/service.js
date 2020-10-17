'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
    },
    fee: {
      type: DataTypes.DOUBLE,
      allowNull:false
    },
  }, {});
  Service.associate = function (models) {
    Service.hasMany(models.Transaction);
  };
  return Service;
};


