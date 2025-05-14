import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createSociety,
  getUserSocieties,
  getSociety,
  updateSociety,
  deleteSociety
} from '../controllers/societyController.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticate);

// Créer une nouvelle société
router.post('/', createSociety);

// Obtenir toutes les sociétés de l'utilisateur
router.get('/my-societies', getUserSocieties);

// Obtenir une société spécifique
router.get('/:id', getSociety);

// Mettre à jour une société
router.put('/:id', updateSociety);

// Supprimer une société
router.delete('/:id', deleteSociety);

export default router; 