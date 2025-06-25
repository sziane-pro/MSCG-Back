import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createSimulation,
  getUserSimulations,
  getSimulation,
  updateSimulation,
  deleteSimulation,
  getDashboardStats
} from '../controllers/simulationController.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticate);

// Créer une nouvelle simulation
router.post('/', createSimulation);

// Obtenir toutes les simulations de l'utilisateur connecté (format tableau)
router.get('/', getUserSimulations);

// Obtenir les statistiques du dashboard
router.get('/dashboard/stats', getDashboardStats);

// Obtenir une simulation spécifique avec toutes ses données
router.get('/:id', getSimulation);

// Obtenir les données détaillées d'une simulation pour reconstituer le frontend
router.get('/:id/details', getSimulation); // Même endpoint mais alias pour clarté

// Mettre à jour une simulation
router.put('/:id', updateSimulation);

// Supprimer une simulation
router.delete('/:id', deleteSimulation);

export default router; 