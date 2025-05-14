import { Society, User, Exercice } from '../models/index.js';

// Créer une nouvelle société
export const createSociety = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId; // Obtenu du middleware d'authentification

    const society = await Society.create({ name });
    
    // Associer l'utilisateur créateur à la société
    await society.addUser(userId, { through: 'User_Possess_Society' });

    return res.status(201).json({
      message: 'Société créée avec succès',
      society
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la création de la société',
      error: error.message
    });
  }
};

// Obtenir toutes les sociétés d'un utilisateur
export const getUserSocieties = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const societies = await Society.findAll({
      include: [{
        model: User,
        where: { id_User: userId },
        through: { attributes: [] }
      }]
    });

    return res.json(societies);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des sociétés',
      error: error.message
    });
  }
};

// Obtenir une société spécifique
export const getSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const society = await Society.findOne({
      where: { id_Society: id },
      include: [
        {
          model: User,
          through: { attributes: [] }
        },
        {
          model: Exercice,
          through: { attributes: [] }
        }
      ]
    });

    if (!society) {
      return res.status(404).json({ message: 'Société non trouvée' });
    }

    // Vérifier si l'utilisateur a accès à cette société
    const hasAccess = await society.hasUser(userId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès non autorisé à cette société' });
    }

    return res.json(society);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération de la société',
      error: error.message
    });
  }
};

// Mettre à jour une société
export const updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.userId;

    const society = await Society.findByPk(id);
    if (!society) {
      return res.status(404).json({ message: 'Société non trouvée' });
    }

    // Vérifier si l'utilisateur a accès à cette société
    const hasAccess = await society.hasUser(userId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès non autorisé à cette société' });
    }

    await society.update({ name });

    return res.json({
      message: 'Société mise à jour avec succès',
      society
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour de la société',
      error: error.message
    });
  }
};

// Supprimer une société
export const deleteSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const society = await Society.findByPk(id);
    if (!society) {
      return res.status(404).json({ message: 'Société non trouvée' });
    }

    // Vérifier si l'utilisateur a accès à cette société
    const hasAccess = await society.hasUser(userId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès non autorisé à cette société' });
    }

    await society.destroy();

    return res.json({ message: 'Société supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la société',
      error: error.message
    });
  }
}; 