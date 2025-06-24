import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class CategoriBudget extends Model {
    static associate(models) {
      CategoriBudget.belongsTo(models.Simulation, {
        foreignKey: 'simulationId',
        as: 'simulation'
      });
    }
  }

  CategoriBudget.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nom de la catégorie'
      },
      monthlyAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Montant mensuel'
      },
      categoryType: {
        type: DataTypes.ENUM('vital', 'confort'),
        allowNull: false,
        comment: 'Type de catégorie: vital ou confort'
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
      modelName: 'CategoriBudget',
      timestamps: true,
      indexes: [
        {
          fields: ['simulationId']
        }
      ]
    }
  );

  return CategoriBudget;
}; 