import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Jury_Status extends Model {
    static associate(models) {
      // Relations définies dans index.js
    }
  }

  Jury_Status.init(
    {
      id_Jury_Status: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      factor_1: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      factor_2: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      factor_3: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      factor_4: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      factor_5: {
        type: DataTypes.FLOAT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Jury_Status',
      tableName: 'Jury_Statuses',
      timestamps: true,
    }
  );

  return Jury_Status;
}; 