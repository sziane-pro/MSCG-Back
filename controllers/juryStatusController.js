import { JuryStatus, Simulation, Exercice, Society, User } from '../models/index.js';

// Créer un nouveau statut de jury
export const createJuryStatus = async (req, res) => {
  try {
    const { name, factor_1, factor_2, factor_3, factor_4, factor_5, simulationId } = req.body;
    const userId = req.user.userId;

    // Vérifier si l'utilisateur a accès à la simulation
    const simulation = await Simulation.findOne({
      where: { id_Simulation: simulationId },
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
      return res.status(404).json({ message: 'Simulation non trouvée ou accès non autorisé' });
    }

    const juryStatus = await JuryStatus.create({
      name,
      factor_1,
      factor_2,
      factor_3,
      factor_4,
      factor_5
    });

    await juryStatus.addSimulation(simulation);

    return res.status(201).json({
      message: 'Statut de jury créé avec succès',
      juryStatus
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la création du statut de jury',
      error: error.message
    });
  }
};

// Obtenir tous les statuts de jury d'une simulation
export const getSimulationJuryStatuses = async (req, res) => {
  try {
    const { simulationId } = req.params;
    const userId = req.user.userId;

    const juryStatuses = await JuryStatus.findAll({
      include: [{
        model: Simulation,
        where: { id_Simulation: simulationId },
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
      }]
    });

    return res.json(juryStatuses);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des statuts de jury',
      error: error.message
    });
  }
};

// Obtenir un statut de jury spécifique
export const getJuryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const juryStatus = await JuryStatus.findOne({
      where: { id_Jury_Status: id },
      include: [{
        model: Simulation,
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
      }]
    });

    if (!juryStatus) {
      return res.status(404).json({ message: 'Statut de jury non trouvé' });
    }

    return res.json(juryStatus);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération du statut de jury',
      error: error.message
    });
  }
};

// Mettre à jour un statut de jury
export const updateJuryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, factor_1, factor_2, factor_3, factor_4, factor_5 } = req.body;
    const userId = req.user.userId;

    const juryStatus = await JuryStatus.findOne({
      where: { id_Jury_Status: id },
      include: [{
        model: Simulation,
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
      }]
    });

    if (!juryStatus) {
      return res.status(404).json({ message: 'Statut de jury non trouvé' });
    }

    await juryStatus.update({
      name,
      factor_1,
      factor_2,
      factor_3,
      factor_4,
      factor_5
    });

    return res.json({
      message: 'Statut de jury mis à jour avec succès',
      juryStatus
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut de jury',
      error: error.message
    });
  }
};

// Supprimer un statut de jury
export const deleteJuryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const juryStatus = await JuryStatus.findOne({
      where: { id_Jury_Status: id },
      include: [{
        model: Simulation,
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
      }]
    });

    if (!juryStatus) {
      return res.status(404).json({ message: 'Statut de jury non trouvé' });
    }

    await juryStatus.destroy();

    return res.json({ message: 'Statut de jury supprimé avec succès' });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la suppression du statut de jury',
      error: error.message
    });
  }
}; 