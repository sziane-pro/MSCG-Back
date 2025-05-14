import { SupplData, User, Simulation, Exercice, Society } from '../models/index.js';

// Créer une nouvelle donnée supplémentaire
export const createSupplData = async (req, res) => {
  try {
    const { name, val, nNumLigne, date_Appli, simulationId } = req.body;
    const userId = req.user.userId;

    let targetSimulation = null;
    if (simulationId) {
      // Vérifier si l'utilisateur a accès à la simulation
      targetSimulation = await Simulation.findOne({
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

      if (!targetSimulation) {
        return res.status(404).json({ message: 'Simulation non trouvée ou accès non autorisé' });
      }
    }

    const supplData = await SupplData.create({
      name,
      val,
      nNumLigne,
      date_Appli
    });

    if (targetSimulation) {
      await supplData.addSimulation(targetSimulation);
    } else {
      // Si pas de simulation, associer directement à l'utilisateur
      const user = await User.findByPk(userId);
      await supplData.addUser(user, { through: 'User_Possess_Chiffre' });
    }

    return res.status(201).json({
      message: 'Donnée supplémentaire créée avec succès',
      supplData
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la création de la donnée supplémentaire',
      error: error.message
    });
  }
};

// Obtenir toutes les données supplémentaires d'une simulation
export const getSimulationSupplData = async (req, res) => {
  try {
    const { simulationId } = req.params;
    const userId = req.user.userId;

    const supplDataList = await SupplData.findAll({
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

    return res.json(supplDataList);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des données supplémentaires',
      error: error.message
    });
  }
};

// Obtenir toutes les données supplémentaires d'un utilisateur
export const getUserSupplData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const supplDataList = await SupplData.findAll({
      include: [{
        model: User,
        where: { id_User: userId },
        through: 'User_Possess_Chiffre'
      }]
    });

    return res.json(supplDataList);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des données supplémentaires',
      error: error.message
    });
  }
};

// Obtenir une donnée supplémentaire spécifique
export const getSupplData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const supplData = await SupplData.findOne({
      where: { id_Suppl_Data: id },
      include: [
        {
          model: User,
          where: { id_User: userId },
          through: 'User_Possess_Chiffre'
        },
        {
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
        }
      ]
    });

    if (!supplData) {
      return res.status(404).json({ message: 'Donnée supplémentaire non trouvée' });
    }

    return res.json(supplData);
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération de la donnée supplémentaire',
      error: error.message
    });
  }
};

// Mettre à jour une donnée supplémentaire
export const updateSupplData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, val, nNumLigne, date_Appli } = req.body;
    const userId = req.user.userId;

    const supplData = await SupplData.findOne({
      where: { id_Suppl_Data: id },
      include: [
        {
          model: User,
          where: { id_User: userId },
          through: 'User_Possess_Chiffre'
        }
      ]
    });

    if (!supplData) {
      return res.status(404).json({ message: 'Donnée supplémentaire non trouvée' });
    }

    await supplData.update({
      name,
      val,
      nNumLigne,
      date_Appli
    });

    return res.json({
      message: 'Donnée supplémentaire mise à jour avec succès',
      supplData
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour de la donnée supplémentaire',
      error: error.message
    });
  }
};

// Supprimer une donnée supplémentaire
export const deleteSupplData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const supplData = await SupplData.findOne({
      where: { id_Suppl_Data: id },
      include: [
        {
          model: User,
          where: { id_User: userId },
          through: 'User_Possess_Chiffre'
        }
      ]
    });

    if (!supplData) {
      return res.status(404).json({ message: 'Donnée supplémentaire non trouvée' });
    }

    await supplData.destroy();

    return res.json({ message: 'Donnée supplémentaire supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la donnée supplémentaire',
      error: error.message
    });
  }
}; 