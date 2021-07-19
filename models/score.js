module.exports = function(sequelize, DataTypes) {
  const Score = sequelize.define("Score", {
    score: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Score.associate = models => {
    Score.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Score;
};