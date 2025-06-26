import { 
  Simulation, 
  User, 
  SimulationResults 
} from '../models/index.js';

// Créer une nouvelle simulation avec résultats
export const createSimulation = async (req, res) => {
  const transaction = await Simulation.sequelize.transaction();
  
  try {
    const userId = req.user.userId;
    const {
      name,
      totalMonthlyVital = 0,
      totalMonthlyComfortCharges = 0,
      totalMonthlyImprovedIncome = 0,
      totalOperatingCharges = 0,
      breakevenThreshold = 0,
      microEnterpriseRevenue = 0,
      enterpriseRevenue = 0,
      bestOption = 'micro'
    } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Le nom de la simulation est requis.' });
    }

    // Créer la simulation
    const simulation = await Simulation.create({
      name: name.trim(),
      userId
    }, { transaction });

    // Créer les résultats associés
    const results = await SimulationResults.create({
      simulationId: simulation.id,
      totalMonthlyVital: parseFloat(totalMonthlyVital) || 0,
      totalMonthlyComfortCharges: parseFloat(totalMonthlyComfortCharges) || 0,
      totalMonthlyImprovedIncome: parseFloat(totalMonthlyImprovedIncome) || 0,
      totalOperatingCharges: parseFloat(totalOperatingCharges) || 0,
      breakevenThreshold: parseFloat(breakevenThreshold) || 0,
      microEnterpriseRevenue: parseFloat(microEnterpriseRevenue) || 0,
      enterpriseRevenue: parseFloat(enterpriseRevenue) || 0,
      bestOption: bestOption || 'micro',
      calculatedAt: new Date()
    }, { transaction });

    await transaction.commit();

    // Retourner la simulation avec ses résultats
    const fullSimulation = await Simulation.findByPk(simulation.id, {
      include: [{
        model: SimulationResults,
        as: 'results'
      }]
    });

    return res.status(201).json({
      message: 'Simulation créée avec succès',
      simulation: fullSimulation
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Erreur création simulation:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Obtenir toutes les simulations de l'utilisateur
export const getUserSimulations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const simulations = await Simulation.findAll({
      where: { userId },
      include: [{
        model: SimulationResults,
        as: 'results'
      }],
      order: [['createdAt', 'DESC']]
    });

    // Formater pour le frontend
    const formattedSimulations = simulations.map(sim => ({
      id: sim.id,
      nom: sim.name,
      name: sim.name,
      date: sim.createdAt.toISOString().split('T')[0],
      ca: sim.results ? `${Math.round(sim.results.microEnterpriseRevenue).toLocaleString()} €` : '-',
      revenuNet: sim.results ? `${Math.round(sim.results.totalMonthlyImprovedIncome).toLocaleString()} €` : '-',
      bestOption: sim.results?.bestOption || 'micro',
      createdAt: sim.createdAt,
      updatedAt: sim.updatedAt
    }));

    return res.json(formattedSimulations);
  } catch (error) {
    console.error('Erreur récupération simulations:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Obtenir une simulation complète
export const getSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id, userId },
      include: [{
        model: SimulationResults,
        as: 'results'
      }]
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    return res.json(simulation);
  } catch (error) {
    console.error('Erreur récupération simulation:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Mettre à jour une simulation
export const updateSimulation = async (req, res) => {
  const transaction = await Simulation.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const {
      name,
      totalMonthlyVital,
      totalMonthlyComfortCharges,
      totalMonthlyImprovedIncome,
      totalOperatingCharges,
      breakevenThreshold,
      microEnterpriseRevenue,
      enterpriseRevenue,
      bestOption
    } = req.body;

    // Vérifier que la simulation existe
    const simulation = await Simulation.findOne({
      where: { id, userId }
    });

    if (!simulation) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    // Mettre à jour le nom de la simulation si fourni
    if (name) {
      await simulation.update({ name: name.trim() }, { transaction });
    }

    // Mettre à jour les résultats s'ils existent
    const results = await SimulationResults.findOne({
      where: { simulationId: id }
    });

    if (results) {
      const updateData = {};
      if (totalMonthlyVital !== undefined) updateData.totalMonthlyVital = parseFloat(totalMonthlyVital);
      if (totalMonthlyComfortCharges !== undefined) updateData.totalMonthlyComfortCharges = parseFloat(totalMonthlyComfortCharges);
      if (totalMonthlyImprovedIncome !== undefined) updateData.totalMonthlyImprovedIncome = parseFloat(totalMonthlyImprovedIncome);
      if (totalOperatingCharges !== undefined) updateData.totalOperatingCharges = parseFloat(totalOperatingCharges);
      if (breakevenThreshold !== undefined) updateData.breakevenThreshold = parseFloat(breakevenThreshold);
      if (microEnterpriseRevenue !== undefined) updateData.microEnterpriseRevenue = parseFloat(microEnterpriseRevenue);
      if (enterpriseRevenue !== undefined) updateData.enterpriseRevenue = parseFloat(enterpriseRevenue);
      if (bestOption !== undefined) updateData.bestOption = bestOption;

      if (Object.keys(updateData).length > 0) {
        updateData.calculatedAt = new Date();
        await results.update(updateData, { transaction });
      }
    }

    await transaction.commit();

    // Retourner la simulation mise à jour
    const updatedSimulation = await Simulation.findByPk(id, {
      include: [{
        model: SimulationResults,
        as: 'results'
      }]
    });

    return res.json({
      message: 'Simulation mise à jour avec succès',
      simulation: updatedSimulation
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Erreur mise à jour simulation:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
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
      where: { id, userId }
    });

    if (!simulation) {
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    // La suppression en cascade va supprimer automatiquement les résultats
    await simulation.destroy();

    return res.json({ message: 'Simulation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression simulation:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Obtenir les statistiques du dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const simulations = await Simulation.findAll({
      where: { userId },
      include: [{
        model: SimulationResults,
        as: 'results'
      }]
    });

    if (simulations.length === 0) {
      return res.json({
        chiffreAffaire: '0 €',
        charge: '0 €',
        beneficeNet: '0 €',
        tauxCharge: '0%',
        rawData: {
          totalCA: 0,
          totalCharges: 0,
          totalRevenuNet: 0
        }
      });
    }

    // Calculer les totaux
    let totalCA = 0;
    let totalCharges = 0;
    let totalRevenuNet = 0;

    simulations.forEach(sim => {
      if (sim.results) {
        // Prendre le meilleur revenu (micro ou entreprise)
        const bestRevenue = Math.max(
          parseFloat(sim.results.microEnterpriseRevenue) || 0,
          parseFloat(sim.results.enterpriseRevenue) || 0
        );
        totalCA += bestRevenue;
        
        const charges = (parseFloat(sim.results.totalMonthlyVital) || 0) + 
                       (parseFloat(sim.results.totalMonthlyComfortCharges) || 0) + 
                       (parseFloat(sim.results.totalOperatingCharges) || 0);
        totalCharges += charges;
        
        totalRevenuNet += parseFloat(sim.results.totalMonthlyImprovedIncome) || 0;
      }
    });

    const tauxCharge = totalCA > 0 ? (totalCharges / totalCA * 100) : 0;

    return res.json({
      chiffreAffaire: `${Math.round(totalCA).toLocaleString()} €`,
      charge: `${Math.round(totalCharges).toLocaleString()} €`,
      beneficeNet: `${Math.round(totalRevenuNet).toLocaleString()} €`,
      tauxCharge: `${tauxCharge.toFixed(1)}%`,
      rawData: {
        totalCA: Math.round(totalCA),
        totalCharges: Math.round(totalCharges),
        totalRevenuNet: Math.round(totalRevenuNet)
      }
    });

  } catch (error) {
    console.error('Erreur stats dashboard:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
}; 