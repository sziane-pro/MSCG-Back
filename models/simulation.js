import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Simulation extends Model {
    static associate(models) {
      // Relation avec User
      Simulation.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      
      // Relation avec SimulationResults
      Simulation.hasOne(models.SimulationResults, {
        foreignKey: 'simulationId',
        as: 'results'
      });
    }
  }

  Simulation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Nom de la simulation'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'Simulation',
      timestamps: true,
    }
  );

  return Simulation;
}; 