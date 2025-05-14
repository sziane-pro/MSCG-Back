import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import societyRoutes from './routes/societyRoutes.js';
import exerciceRoutes from './routes/exerciceRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import juryStatusRoutes from './routes/juryStatusRoutes.js';
import supplDataRoutes from './routes/supplDataRoutes.js';

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
app.use('/api/societies', societyRoutes);
app.use('/api/exercices', exerciceRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/jury-status', juryStatusRoutes);
app.use('/api/suppl-data', supplDataRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
