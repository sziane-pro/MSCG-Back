import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createExercice,
  getSocietyExercices,
  getExercice,
  updateExercice,
  deleteExercice
} from '../controllers/exerciceController.js';

const router = express.Router();

// Routes protégées par authentification
router.use(authenticate);

// Créer un nouvel exercice
router.post('/', createExercice);

// Obtenir tous les exercices d'une société
router.get('/society/:societyId', getSocietyExercices);

// Obtenir un exercice spécifique
router.get('/:id', getExercice);

// Mettre à jour un exercice
router.put('/:id', updateExercice);

// Supprimer un exercice
router.delete('/:id', deleteExercice);

export default router; 