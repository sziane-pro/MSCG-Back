import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Suppl_Data extends Model {
    static associate(models) {
      // Relations définies dans index.js
    }
  }

  Suppl_Data.init(
    {
      id_Suppl_Data: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      val: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      nNumLigne: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date_Appli: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Suppl_Data',
      tableName: 'Suppl_Data',
      timestamps: true,
    }
  );

  return Suppl_Data;
}; 