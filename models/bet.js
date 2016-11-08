'use strict';
module.exports = function(sequelize, DataTypes) {
  var bet = sequelize.define('bet', {
    tableId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    betAmt: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.bet.belongsTo(models.player);
      }
    }
  });
  return bet;
};
