import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';

console.log('🚀 Démarrage du serveur...');

const app = express();
app.use(express.json());
app.use(cors());

console.log('🛠 Tentative de connexion à la base de données...');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à PostgreSQL réussie !');
    return sequelize.sync();
  })

  
// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
