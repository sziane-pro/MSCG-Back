import { Exercice, Society, Simulation } from '../models/index.js';

// Créer un nouvel exercice
export const createExercice = async (req, res) => {
  try {
    const { name, numero, date_Start, date_End, societyId } = req.body;
    const userId = req.user.userId;

    // Vérifier si l'utilisateur a accès à la société
    const society = await Society.findByPk(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Société non trouvée' });
    }

    const hasAccess = await society.hasUser(userId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès non autorisé à cette société' });
    }

    const exercice = await Exercice.create({
      name,
      numero,
      date_Start,
      date_End
    });

    // Associer l'exercice à la société
    await exercice.addSociety(society);

    return res.status(201).json({
      message: 'Exercice créé avec succès',
      exercice
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la création de l\'exercice',
      error: error.message
    });
  }
};

// Obtenir tous les exercices d'une société
export const getSocietyExercices = async (req, res) => {
  try {
    const { societyId } = req.params;
    const userId = req.user.userId;

    // Vérifier l'accès à la société
    const society = await Society.findByPk(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Société non trouvée' });
    }

    const hasAccess = await society.hasUser(userId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès non autorisé à cette société' });
    }

    const exercices = await Exercice.findAll({
      include: [{
        model: Society,
        where: { id_Society: societyId },
        through: { attributes: [] }
      }]
    });

    return res.json(exercices);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des exercices',
      error: error.message
    });
  }
};

// Obtenir un exercice spécifique
export const getExercice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const exercice = await Exercice.findOne({
      where: { id_Exercice: id },
      include: [
        {
          model: Society,
          include: [{
            model: User,
            where: { id_User: userId },
            through: { attributes: [] }
          }]
        },
        {
          model: Simulation,
          through: { attributes: [] }
        }
      ]
    });

    if (!exercice) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    return res.json(exercice);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération de l\'exercice',
      error: error.message
    });
  }
};

// Mettre à jour un exercice
export const updateExercice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, numero, date_Start, date_End } = req.body;
    const userId = req.user.userId;

    const exercice = await Exercice.findOne({
      where: { id_Exercice: id },
      include: [{
        model: Society,
        include: [{
          model: User,
          where: { id_User: userId },
          through: { attributes: [] }
        }]
      }]
    });

    if (!exercice) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    await exercice.update({
      name,
      numero,
      date_Start,
      date_End
    });

    return res.json({
      message: 'Exercice mis à jour avec succès',
      exercice
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour de l\'exercice',
      error: error.message
    });
  }
};

// Supprimer un exercice
export const deleteExercice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const exercice = await Exercice.findOne({
      where: { id_Exercice: id },
      include: [{
        model: Society,
        include: [{
          model: User,
          where: { id_User: userId },
          through: { attributes: [] }
        }]
      }]
    });

    if (!exercice) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    await exercice.destroy();

    return res.json({ message: 'Exercice supprimé avec succès' });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la suppression de l\'exercice',
      error: error.message
    });
  }
}; 