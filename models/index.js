import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME || 'mscg_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Désactiver les logs SQL en production
  }
);

// Import des modèles
import userModel from './user.js';
import simulationModel from './simulation.js';
import simulationResultsModel from './simulationResults.js';

// Initialisation des modèles
const User = userModel(sequelize);
const Simulation = simulationModel(sequelize);
const SimulationResults = simulationResultsModel(sequelize);

// Configuration des associations
const models = {
  User,
  Simulation,
  SimulationResults
};

// Initialiser les associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export
export { 
  sequelize, 
  User, 
  Simulation, 
  SimulationResults 
};
