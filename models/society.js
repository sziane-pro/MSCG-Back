import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Society extends Model {
    static associate(models) {
      // Relations définies dans index.js
    }
  }

  Society.init(
    {
      id_Society: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
    },
    {
      sequelize,
      modelName: 'Society',
      tableName: 'Societys', // Nom de table explicite
      timestamps: true,
    }
  );

  return Society;
}; 