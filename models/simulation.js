import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Simulation extends Model {
    static associate(models) {
      // Relations définies dans index.js
    }
  }

  Simulation.init(
    {
      id_Simulation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      CA_HT: { 
        type: DataTypes.FLOAT, 
        allowNull: true 
      },
    },
    {
      sequelize,
      modelName: 'Simulation',
      tableName: 'Simulations',
      timestamps: true,
    }
  );

  return Simulation;
}; 