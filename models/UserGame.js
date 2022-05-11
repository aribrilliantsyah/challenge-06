'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.UserGameBiodata, {
        foreignKey: 'user_game_id',
        as: 'biodata'
      })
      this.hasMany(models.UserGameHistory, {
        foreignKey: 'user_game_id',
        as: 'histories'
      })
    }
  }
  UserGame.init({
    uid: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserGame',
    tableName: 'user_game'
  });
  return UserGame;
};