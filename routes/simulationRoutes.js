import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createSimulation,
  getExerciceSimulations,
  getSimulation,
  updateSimulation,
  deleteSimulation
} from '../controllers/simulationController.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticate);

// Créer une nouvelle simulation
router.post('/', createSimulation);

// Obtenir toutes les simulations d'un exercice
router.get('/exercice/:exerciceId', getExerciceSimulations);

// Obtenir une simulation spécifique
router.get('/:id', getSimulation);

// Mettre à jour une simulation
router.put('/:id', updateSimulation);

// Supprimer une simulation
router.delete('/:id', deleteSimulation);

export default router; 