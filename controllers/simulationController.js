import { Simulation, User } from '../models/index.js';

// Créer une nouvelle simulation
export const createSimulation = async (req, res) => {
  try {
    const { nom, ca, revenuNet, statut = 'En cours' } = req.body;
    const userId = req.user.userId;

    // Validation des données
    if (!nom) {
      return res.status(400).json({ message: 'Le nom de la simulation est requis.' });
    }

    const simulation = await Simulation.create({
      nom,
      statut,
      ca,
      revenuNet,
      userId
    });

    return res.status(201).json({
      message: 'Simulation créée avec succès',
      simulation: {
        id: simulation.id,
        nom: simulation.nom,
        statut: simulation.statut,
        date: simulation.createdAt.toISOString().split('T')[0], // Format YYYY-MM-DD
        ca: simulation.ca,
        revenuNet: simulation.revenuNet
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir toutes les simulations de l'utilisateur connecté
export const getUserSimulations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const simulations = await Simulation.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    const formattedSimulations = simulations.map(sim => ({
      id: sim.id,
      nom: sim.nom,
      statut: sim.statut,
      date: sim.createdAt.toISOString().split('T')[0], // Format YYYY-MM-DD
      ca: sim.ca,
      revenuNet: sim.revenuNet
    }));

    return res.json(formattedSimulations);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir une simulation spécifique
export const getSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id, userId }
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    return res.json({
      id: simulation.id,
      nom: simulation.nom,
      statut: simulation.statut,
      date: simulation.createdAt.toISOString().split('T')[0],
      ca: simulation.ca,
      revenuNet: simulation.revenuNet
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour une simulation
export const updateSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, ca, revenuNet, statut } = req.body;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id, userId }
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    await simulation.update({
      nom: nom || simulation.nom,
      statut: statut || simulation.statut,
      ca: ca || simulation.ca,
      revenuNet: revenuNet || simulation.revenuNet
    });

    return res.json({
      message: 'Simulation mise à jour avec succès',
      simulation: {
        id: simulation.id,
        nom: simulation.nom,
        statut: simulation.statut,
        date: simulation.createdAt.toISOString().split('T')[0],
        ca: simulation.ca,
        revenuNet: simulation.revenuNet
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une simulation
export const deleteSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id, userId }
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    await simulation.destroy();

    return res.json({ message: 'Simulation supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les statistiques pour le dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const simulations = await Simulation.findAll({
      where: { userId, statut: 'Terminée' }
    });

    // Calculs simplifiés pour le dashboard
    const totalSimulations = simulations.length;
    const totalCA = simulations.reduce((sum, sim) => {
      const ca = parseFloat(sim.ca?.replace(/[^0-9.-]+/g,"") || "0");
      return sum + ca;
    }, 0);
    
    const totalRevenuNet = simulations.reduce((sum, sim) => {
      const revenu = parseFloat(sim.revenuNet?.replace(/[^0-9.-]+/g,"") || "0");
      return sum + revenu;
    }, 0);

    const charges = totalCA - totalRevenuNet;
    const tauxCharge = totalCA > 0 ? ((charges / totalCA) * 100).toFixed(1) : 0;

    return res.json({
      chiffreAffaire: `${totalCA.toLocaleString()} €`,
      charge: `${charges.toLocaleString()} €`,
      beneficeNet: `${totalRevenuNet.toLocaleString()} €`,
      tauxCharge: `${tauxCharge}%`,
      nombreSimulations: totalSimulations
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}; 