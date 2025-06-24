import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class SimulationParameters extends Model {
    static associate(models) {
      SimulationParameters.belongsTo(models.Simulation, {
        foreignKey: 'simulationId',
        as: 'simulation'
      });
    }
  }

  SimulationParameters.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Paramètres temporels
      timeHorizon: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Horizon temporel en mois'
      },
      adjustmentPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Période d\'ajustement en mois'
      },
      growthRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Taux de croissance en pourcentage'
      },
      coefficient: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Coefficient multiplicateur'
      },
      
      // Paramètres charges sociales
      socialChargesRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Taux charges sociales en pourcentage'
      },
      socialChargesMaxBase: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Assiette maximale charges sociales'
      },
      microBrutMarginRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Taux marge brute micro en pourcentage'
      },
      
      simulationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Simulations',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'SimulationParameters',
      timestamps: true,
      indexes: [
        {
          fields: ['simulationId']
        }
      ]
    }
  );

  return SimulationParameters;
}; 