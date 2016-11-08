'use strict';
module.exports = function(sequelize, DataTypes) {
  var player = sequelize.define('player', {
    userId: DataTypes.INTEGER,
    tableId: DataTypes.INTEGER,
    gameCredit: DataTypes.INTEGER,
    betAmount: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.player.belongsTo(models.user, {through: 'table'});
        models.player.hasOne(models.bet);
        models.player.hasMany(models.payout);
      }
    }
  });
  return player;
};
