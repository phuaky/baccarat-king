'use strict';
module.exports = function(sequelize, DataTypes) {
  var table = sequelize.define('table', {
    bankerId: DataTypes.INTEGER,
    startGame: DataTypes.STRING,
    endGame: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.table.belongsTo(models.banker);
      }
    }
  });
  return table;
};
