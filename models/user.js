import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Relations définies dans index.js
    }
  }

  User.init(
    {
      id_User: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      login: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
      },
      pwd: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      surname: { 
        type: DataTypes.STRING,
        allowNull: true 
      },
      city: { 
        type: DataTypes.STRING,
        allowNull: true 
      },
      postalCode: { 
        type: DataTypes.STRING,
        allowNull: true 
      },
      fact_Addr: { 
        type: DataTypes.STRING,
        allowNull: true 
      },
      dateCreate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      dateUpdate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      attente_Suppr: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      MC_1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MC_2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MC_3: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MC_4: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MC_5: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: false, // On gère manuellement avec dateCreate et dateUpdate
    }
  );

  return User;
};
