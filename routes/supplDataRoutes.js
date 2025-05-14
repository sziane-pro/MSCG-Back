import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createSupplData,
  getSimulationSupplData,
  getUserSupplData,
  getSupplData,
  updateSupplData,
  deleteSupplData
} from '../controllers/supplDataController.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticate);

// Créer une nouvelle donnée supplémentaire
router.post('/', createSupplData);

// Obtenir toutes les données supplémentaires d'une simulation
router.get('/simulation/:simulationId', getSimulationSupplData);

// Obtenir toutes les données supplémentaires de l'utilisateur
router.get('/user', getUserSupplData);

// Obtenir une donnée supplémentaire spécifique
router.get('/:id', getSupplData);

// Mettre à jour une donnée supplémentaire
router.put('/:id', updateSupplData);

// Supprimer une donnée supplémentaire
router.delete('/:id', deleteSupplData);

export default router; 