import { Simulation, Exercice, Society, User, JuryStatus, SupplData } from '../models/index.js';

// Créer une nouvelle simulation
export const createSimulation = async (req, res) => {
  try {
    const { CA_HT, exerciceId } = req.body;
    const userId = req.user.userId;

    // Vérifier si l'exercice existe et si l'utilisateur y a accès
    const exercice = await Exercice.findOne({
      where: { id_Exercice: exerciceId },
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
      return res.status(404).json({ message: 'Exercice non trouvé ou accès non autorisé' });
    }

    const simulation = await Simulation.create({ CA_HT });
    await simulation.addExercice(exercice);

    return res.status(201).json({
      message: 'Simulation créée avec succès',
      simulation
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la création de la simulation',
      error: error.message
    });
  }
};

// Obtenir toutes les simulations d'un exercice
export const getExerciceSimulations = async (req, res) => {
  try {
    const { exerciceId } = req.params;
    const userId = req.user.userId;

    const simulations = await Simulation.findAll({
      include: [
        {
          model: Exercice,
          where: { id_Exercice: exerciceId },
          include: [{
            model: Society,
            include: [{
              model: User,
              where: { id_User: userId },
              through: { attributes: [] }
            }]
          }]
        },
        {
          model: JuryStatus,
          through: { attributes: [] }
        },
        {
          model: SupplData,
          through: { attributes: [] }
        }
      ]
    });

    return res.json(simulations);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des simulations',
      error: error.message
    });
  }
};

// Obtenir une simulation spécifique
export const getSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id_Simulation: id },
      include: [
        {
          model: Exercice,
          include: [{
            model: Society,
            include: [{
              model: User,
              where: { id_User: userId },
              through: { attributes: [] }
            }]
          }]
        },
        {
          model: JuryStatus,
          through: { attributes: [] }
        },
        {
          model: SupplData,
          through: { attributes: [] }
        }
      ]
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    return res.json(simulation);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération de la simulation',
      error: error.message
    });
  }
};

// Mettre à jour une simulation
export const updateSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { CA_HT } = req.body;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id_Simulation: id },
      include: [{
        model: Exercice,
        include: [{
          model: Society,
          include: [{
            model: User,
            where: { id_User: userId },
            through: { attributes: [] }
          }]
        }]
      }]
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    await simulation.update({ CA_HT });

    return res.json({
      message: 'Simulation mise à jour avec succès',
      simulation
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour de la simulation',
      error: error.message
    });
  }
};

// Supprimer une simulation
export const deleteSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id_Simulation: id },
      include: [{
        model: Exercice,
        include: [{
          model: Society,
          include: [{
            model: User,
            where: { id_User: userId },
            through: { attributes: [] }
          }]
        }]
      }]
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    await simulation.destroy();

    return res.json({ message: 'Simulation supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la simulation',
      error: error.message
    });
  }
}; 