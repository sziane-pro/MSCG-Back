import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class OperatingCharges extends Model {
    static associate(models) {
      OperatingCharges.belongsTo(models.Simulation, {
        foreignKey: 'simulationId',
        as: 'simulation'
      });
    }
  }

  OperatingCharges.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nom de la charge'
      },
      monthlyAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Montant mensuel'
      },
      simulationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Simulations',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'OperatingCharges',
      timestamps: true,
      indexes: [
        {
          fields: ['simulationId']
        }
      ]
    }
  );

  return OperatingCharges;
}; 