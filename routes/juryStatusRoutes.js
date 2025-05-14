import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createJuryStatus,
  getSimulationJuryStatuses,
  getJuryStatus,
  updateJuryStatus,
  deleteJuryStatus
} from '../controllers/juryStatusController.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticate);

// Créer un nouveau statut de jury
router.post('/', createJuryStatus);

// Obtenir tous les statuts de jury d'une simulation
router.get('/simulation/:simulationId', getSimulationJuryStatuses);

// Obtenir un statut de jury spécifique
router.get('/:id', getJuryStatus);

// Mettre à jour un statut de jury
router.put('/:id', updateJuryStatus);

// Supprimer un statut de jury
router.delete('/:id', deleteJuryStatus);

export default router; 