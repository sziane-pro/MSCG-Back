import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Exercice extends Model {
    static associate(models) {
      // Relations définies dans index.js
    }
  }

  Exercice.init(
    {
      id_Exercice: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      numero: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date_Start: {
        type: DataTypes.DATE,
        allowNull: false
      },
      date_End: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Exercice',
      tableName: 'Exercices',
      timestamps: true,
    }
  );

  return Exercice;
}; 