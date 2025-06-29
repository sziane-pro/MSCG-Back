import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';

// Import des routes simplifiées
import authRoutes from './routes/authRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';

console.log('🚀 Démarrage du serveur MSCG ...');

const app = express();
app.use(express.json());
app.use(cors());

console.log('🛠 Tentative de connexion à la base de données...');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à PostgreSQL réussie !');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à la base de données:', error);
  });

// Routes simplifiées selon les besoins du frontend
app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MSCG Backend',
    models: ['User', 'Simulation', 'SimulationResults']
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Serveur MSCG démarré sur http://localhost:${PORT}`);
});
