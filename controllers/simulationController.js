import { 
  Simulation, 
  User, 
  CategoriBudget, 
  OperatingCharges, 
  SimulationParameters, 
  SimulationResults 
} from '../models/index.js';

// Créer une nouvelle simulation complète
export const createSimulation = async (req, res) => {
  const transaction = await Simulation.sequelize.transaction();
  
  try {
    const userId = req.user.userId;
    const {
      name,
      categories = [],           // Charges vitales
      comfortCategories = [],    // Charges de confort
      operatingCharges = [],     // Charges professionnelles
      parameters = {},           // Paramètres temporels et charges sociales
      results = {}               // Résultats calculés
    } = req.body;

    // Validation des données essentielles
    if (!name) {
      return res.status(400).json({ message: 'Le nom de la simulation est requis.' });
    }

    // 1. Créer la simulation principale
    const simulation = await Simulation.create({
      name,
      userId
    }, { transaction });

    // 2. Sauvegarder les catégories budgétaires (vitales)
    if (categories.length > 0) {
      const vitalCategories = categories.map(cat => ({
        name: cat.name,
        monthlyAmount: cat.monthly || 0,
        categoryType: 'vital',
        simulationId: simulation.id
      }));
      await CategoriBudget.bulkCreate(vitalCategories, { transaction });
    }

    // 3. Sauvegarder les catégories de confort
    if (comfortCategories.length > 0) {
      const comfortCategoriesData = comfortCategories.map(cat => ({
        name: cat.name,
        monthlyAmount: cat.monthly || 0,
        categoryType: 'confort',
        simulationId: simulation.id
      }));
      await CategoriBudget.bulkCreate(comfortCategoriesData, { transaction });
    }

    // 4. Sauvegarder les charges professionnelles
    if (operatingCharges.length > 0) {
      const operatingChargesData = operatingCharges.map(charge => ({
        name: charge.name,
        monthlyAmount: charge.monthly || 0,
        simulationId: simulation.id
      }));
      await OperatingCharges.bulkCreate(operatingChargesData, { transaction });
    }

    // 5. Sauvegarder les paramètres de simulation
    if (Object.keys(parameters).length > 0) {
      await SimulationParameters.create({
        timeHorizon: parameters.timeHorizon || 12,
        adjustmentPeriod: parameters.adjustmentPeriod || 6,
        growthRate: parameters.growthRate || 0,
        coefficient: parameters.coefficient || 1.0,
        socialChargesRate: parameters.socialChargesRate || 0.22,
        socialChargesMaxBase: parameters.socialChargesMaxBase || 45000,
        microBrutMarginRate: parameters.microBrutMarginRate || 0.30,
        simulationId: simulation.id
      }, { transaction });
    }

    // 6. Sauvegarder les résultats calculés
    if (Object.keys(results).length > 0) {
      await SimulationResults.create({
        totalMonthlyRevenue: results.totalMonthlyRevenue || 0,
        totalVitalCharges: results.totalVitalCharges || 0,
        totalComfortCharges: results.totalComfortCharges || 0,
        totalOperatingCharges: results.totalOperatingCharges || 0,
        iterativeChargesResults: results.iterativeChargesResults || [],
        iterativeRevenueResults: results.iterativeRevenueResults || [],
        iterativeSocialChargesResults: results.iterativeSocialChargesResults || [],
        finalNetRevenue: results.finalNetRevenue || 0,
        finalGrossRevenue: results.finalGrossRevenue || 0,
        simulationId: simulation.id
      }, { transaction });
    }

    await transaction.commit();

    // Retourner la simulation créée avec toutes ses relations
    const fullSimulation = await getFullSimulation(simulation.id);

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

// Obtenir toutes les simulations de l'utilisateur connecté (format simplifié pour le tableau)
export const getUserSimulations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const simulations = await Simulation.findAll({
      where: { userId },
      include: [
        {
          model: SimulationResults,
          as: 'results',
          attributes: ['totalMonthlyRevenue', 'finalNetRevenue', 'finalGrossRevenue']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Formater pour le frontend (tableau des simulations)
    const formattedSimulations = simulations.map(sim => ({
      id: sim.id,
      nom: sim.name,  // Mapping nom → name pour compatibilité frontend
      name: sim.name,
      date: sim.createdAt.toISOString().split('T')[0], // Format YYYY-MM-DD
      ca: sim.results ? `${Math.round(sim.results.finalGrossRevenue).toLocaleString()} €` : '-',
      revenuNet: sim.results ? `${Math.round(sim.results.finalNetRevenue).toLocaleString()} €` : '-',
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

// Obtenir une simulation complète avec toutes ses données
export const getSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const simulation = await getFullSimulation(id, userId);

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
    const updateData = req.body;

    // Vérifier que la simulation existe et appartient à l'utilisateur
    const simulation = await Simulation.findOne({
      where: { id, userId }
    });

    if (!simulation) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    // Mettre à jour le nom si fourni
    if (updateData.name) {
      await simulation.update({ name: updateData.name }, { transaction });
    }

    // Mettre à jour les catégories si fournies
    if (updateData.categories || updateData.comfortCategories) {
      // Supprimer les anciennes catégories
      await CategoriBudget.destroy({ 
        where: { simulationId: id }, 
        transaction 
      });

      // Recréer les catégories vitales
      if (updateData.categories && updateData.categories.length > 0) {
        const vitalCategories = updateData.categories.map(cat => ({
          name: cat.name,
          monthlyAmount: cat.monthly || 0,
          categoryType: 'vital',
          simulationId: id
        }));
        await CategoriBudget.bulkCreate(vitalCategories, { transaction });
      }

      // Recréer les catégories de confort
      if (updateData.comfortCategories && updateData.comfortCategories.length > 0) {
        const comfortCategoriesData = updateData.comfortCategories.map(cat => ({
          name: cat.name,
          monthlyAmount: cat.monthly || 0,
          categoryType: 'confort',
          simulationId: id
        }));
        await CategoriBudget.bulkCreate(comfortCategoriesData, { transaction });
      }
    }

    // Mettre à jour les charges professionnelles si fournies
    if (updateData.operatingCharges) {
      await OperatingCharges.destroy({ 
        where: { simulationId: id }, 
        transaction 
      });

      if (updateData.operatingCharges.length > 0) {
        const operatingChargesData = updateData.operatingCharges.map(charge => ({
          name: charge.name,
          monthlyAmount: charge.monthly || 0,
          simulationId: id
        }));
        await OperatingCharges.bulkCreate(operatingChargesData, { transaction });
      }
    }

    // Mettre à jour les paramètres si fournis
    if (updateData.parameters) {
      await SimulationParameters.destroy({ 
        where: { simulationId: id }, 
        transaction 
      });

      await SimulationParameters.create({
        ...updateData.parameters,
        simulationId: id
      }, { transaction });
    }

    // Mettre à jour les résultats si fournis
    if (updateData.results) {
      await SimulationResults.destroy({ 
        where: { simulationId: id }, 
        transaction 
      });

      await SimulationResults.create({
        ...updateData.results,
        simulationId: id
      }, { transaction });
    }

    await transaction.commit();

    // Retourner la simulation mise à jour
    const updatedSimulation = await getFullSimulation(id);

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
  const transaction = await Simulation.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const simulation = await Simulation.findOne({
      where: { id, userId }
    });

    if (!simulation) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Simulation non trouvée' });
    }

    // Les suppressions en cascade sont gérées par les contraintes FK
    await simulation.destroy({ transaction });
    await transaction.commit();

    return res.json({ message: 'Simulation supprimée avec succès' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur suppression simulation:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Obtenir les statistiques pour le dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const simulations = await Simulation.findAll({
      where: { userId },
      include: [
        {
          model: SimulationResults,
          as: 'results',
          attributes: ['finalGrossRevenue', 'finalNetRevenue', 'totalOperatingCharges']
        }
      ]
    });

    // Calculs basés sur les vraies données sauvegardées
    const simulationsWithResults = simulations.filter(sim => sim.results);
    const totalSimulations = simulationsWithResults.length;
    
    const totalCA = simulationsWithResults.reduce((sum, sim) => {
      return sum + (sim.results.finalGrossRevenue || 0);
    }, 0);
    
    const totalRevenuNet = simulationsWithResults.reduce((sum, sim) => {
      return sum + (sim.results.finalNetRevenue || 0);
    }, 0);

    const totalCharges = simulationsWithResults.reduce((sum, sim) => {
      return sum + (sim.results.totalOperatingCharges || 0);
    }, 0);

    const tauxCharge = totalCA > 0 ? ((totalCharges / totalCA) * 100).toFixed(1) : 0;

    return res.json({
      chiffreAffaire: `${Math.round(totalCA).toLocaleString()} €`,
      charge: `${Math.round(totalCharges).toLocaleString()} €`,
      beneficeNet: `${Math.round(totalRevenuNet).toLocaleString()} €`,
      tauxCharge: `${tauxCharge}%`,
      nombreSimulations: totalSimulations,
      // Statistiques détaillées pour graphiques
      rawData: {
        totalCA,
        totalRevenuNet,
        totalCharges,
        totalSimulations
      }
    });
  } catch (error) {
    console.error('Erreur statistiques dashboard:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Fonction utilitaire pour récupérer une simulation complète
const getFullSimulation = async (simulationId, userId = null) => {
  const whereClause = userId ? { id: simulationId, userId } : { id: simulationId };
  
  return await Simulation.findOne({
    where: whereClause,
    include: [
      {
        model: CategoriBudget,
        as: 'categories',
        attributes: ['id', 'name', 'monthlyAmount', 'categoryType']
      },
      {
        model: OperatingCharges,
        as: 'operatingCharges',
        attributes: ['id', 'name', 'monthlyAmount']
      },
      {
        model: SimulationParameters,
        as: 'parameters',
        attributes: { exclude: ['simulationId'] }
      },
      {
        model: SimulationResults,
        as: 'results',
        attributes: { exclude: ['simulationId'] }
      }
    ]
  });
}; 