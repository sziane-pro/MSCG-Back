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
      simulationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Simulations',
          key: 'id'
        }
      },
      totalMonthlyVital: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total mensuel des charges vitales'
      },
      totalMonthlyComfortCharges: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total mensuel des charges de confort'
      },
      totalMonthlyImprovedIncome: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Revenu mensuel amélioré total'
      },
      totalOperatingCharges: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total des charges professionnelles'
      },
      breakevenThreshold: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Seuil de rentabilité'
      },
      microEnterpriseRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Revenu en micro-entreprise'
      },
      enterpriseRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Revenu en entreprise'
      },
      bestOption: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: 'micro',
        validate: {
          isIn: [['micro', 'entreprise', 'egalite']]
        },
        comment: 'Meilleure option fiscale'
      },
      calculatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date de calcul des résultats'
      }
    },
    {
      sequelize,
      modelName: 'SimulationResults',
      timestamps: false, // Pas de createdAt/updatedAt car on a calculatedAt
      indexes: [
        {
          fields: ['simulationId']
        }
      ]
    }
  );

  return SimulationResults;
}; 