import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class SimulationResults extends Model {
    static associate(models) {
      SimulationResults.belongsTo(models.Simulation, {
        foreignKey: 'simulationId',
        as: 'simulation'
      });
    }
  }

  SimulationResults.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      
      // Résultats principaux
      totalMonthlyRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Revenu mensuel total nécessaire'
      },
      totalVitalCharges: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total charges vitales'
      },
      totalComfortCharges: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total charges confort'
      },
      totalOperatingCharges: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total charges professionnelles'
      },
      
      // Résultats itératifs (JSON pour les arrays)
      iterativeChargesResults: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Résultats charges par période (array)'
      },
      iterativeRevenueResults: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Résultats revenus par période (array)'
      },
      iterativeSocialChargesResults: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Résultats charges sociales par période (array)'
      },
      
      // Résultats finaux
      finalNetRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Revenu net final calculé'
      },
      finalGrossRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Revenu brut final calculé'
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
      modelName: 'SimulationResults',
      timestamps: true,
      indexes: [
        {
          fields: ['simulationId']
        }
      ]
    }
  );

  return SimulationResults;
}; 