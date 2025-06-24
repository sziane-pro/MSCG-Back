import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.js';
import SimulationModel from './simulation.js';
import CategoriBudgetModel from './categoriBudget.js';
import OperatingChargesModel from './operatingCharges.js';
import SimulationParametersModel from './simulationParameters.js';
import SimulationResultsModel from './simulationResults.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// Initialisation des modèles
const User = UserModel(sequelize);
const Simulation = SimulationModel(sequelize);
const CategoriBudget = CategoriBudgetModel(sequelize);
const OperatingCharges = OperatingChargesModel(sequelize);
const SimulationParameters = SimulationParametersModel(sequelize);
const SimulationResults = SimulationResultsModel(sequelize);

// Création d'un objet models pour les associations
const models = {
  User,
  Simulation,
  CategoriBudget,
  OperatingCharges,
  SimulationParameters,
  SimulationResults
};

// Définition des associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { 
  sequelize,
  User,
  Simulation,
  CategoriBudget,
  OperatingCharges,
  SimulationParameters,
  SimulationResults
};
