import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.js';
import SocietyModel from './society.js';
import ExerciceModel from './exercice.js';
import SimulationModel from './simulation.js';
import JuryStatusModel from './jury_status.js';
import SupplDataModel from './suppl_data.js';

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
const Society = SocietyModel(sequelize);
const Exercice = ExerciceModel(sequelize);
const Simulation = SimulationModel(sequelize);
const JuryStatus = JuryStatusModel(sequelize);
const SupplData = SupplDataModel(sequelize);

// Définition des relations
// User_Possess_Society (0,1 - 1,1)
User.belongsToMany(Society, { 
  through: 'User_Possess_Society',
  timestamps: true,
  foreignKey: 'id_User',
  otherKey: 'id_Society'
});
Society.belongsToMany(User, { 
  through: 'User_Possess_Society',
  timestamps: true,
  foreignKey: 'id_Society',
  otherKey: 'id_User'
});

// User_Concil_Society (0,n - 0,n)
User.belongsToMany(Society, { 
  through: 'User_Concil_Society',
  timestamps: true,
  as: 'ConcilSocieties'
});
Society.belongsToMany(User, { 
  through: 'User_Concil_Society',
  timestamps: true,
  as: 'ConcilUsers'
});

// Society_Has_Exercice (0,n - 1,1)
Society.belongsToMany(Exercice, {
  through: 'Society_Has_Exercice',
  timestamps: true
});
Exercice.belongsToMany(Society, {
  through: 'Society_Has_Exercice',
  timestamps: true
});

// Exercice_Possess_Simulation (0,n - 1,1)
Exercice.belongsToMany(Simulation, {
  through: 'Exercice_Possess_Simulation',
  timestamps: true
});
Simulation.belongsToMany(Exercice, {
  through: 'Exercice_Possess_Simulation',
  timestamps: true
});

// Simulation_with_status (1,1 - 0,n)
Simulation.belongsToMany(JuryStatus, {
  through: 'Simulation_with_status',
  timestamps: true
});
JuryStatus.belongsToMany(Simulation, {
  through: 'Simulation_with_status',
  timestamps: true
});

// Simulation_Possess_Data (0,n - 1,1)
Simulation.belongsToMany(SupplData, {
  through: 'Simulation_Possess_Data',
  timestamps: true
});
SupplData.belongsToMany(Simulation, {
  through: 'Simulation_Possess_Data',
  timestamps: true
});

// User_Possess_Chiffre (0,n - 1,1)
User.belongsToMany(SupplData, {
  through: 'User_Possess_Chiffre',
  timestamps: true,
  as: 'SupplNumbers'
});
SupplData.belongsToMany(User, {
  through: 'User_Possess_Chiffre',
  timestamps: true
});

export { 
  sequelize,
  User,
  Society,
  Exercice,
  Simulation,
  JuryStatus,
  SupplData
};
