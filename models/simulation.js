import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Simulation extends Model {
    static associate(models) {
      // Relations avec les autres modèles
      Simulation.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      
      Simulation.hasMany(models.CategoriBudget, {
        foreignKey: 'simulationId',
        as: 'categories'
      });
      
      Simulation.hasMany(models.OperatingCharges, {
        foreignKey: 'simulationId',
        as: 'operatingCharges'
      });
      
      Simulation.hasOne(models.SimulationParameters, {
        foreignKey: 'simulationId',
        as: 'parameters'
      });
      
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
        type: DataTypes.STRING,
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