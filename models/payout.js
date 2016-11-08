'use strict';
module.exports = function(sequelize, DataTypes) {
  var payout = sequelize.define('payout', {
    betId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    totalAmt: DataTypes.INTEGER,
    bankerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.payout.belongsTo(models.player);
        models.payout.belongsTo(models.banker);
      }
    }
  });
  return payout;
};
