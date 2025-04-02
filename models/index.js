import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.js';

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

const User = UserModel(sequelize);

export { sequelize };
export default sequelize;

export { User };
