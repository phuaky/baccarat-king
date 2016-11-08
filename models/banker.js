'use strict';
module.exports = function(sequelize, DataTypes) {
  var banker = sequelize.define('banker', {
    userId: DataTypes.INTEGER,
    gameCredit: DataTypes.INTEGER,
    maxBet: DataTypes.INTEGER,
    tableId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.banker.belongsTo(models.user);
        models.banker.hasOne(models.table);
        models.banker.hasMany(models.payout);
      }
    }
  });
  return banker;
};
