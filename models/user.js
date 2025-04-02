import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Associer l'utilisateur à d'autres modèles ici si nécessaire
    }
  }

  User.init(
    {
      login: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      postalCode: { type: DataTypes.STRING },
      factAddr: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      attenteSuppr: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true, // Active createdAt et updatedAt
    }
  );

  return User;
};
