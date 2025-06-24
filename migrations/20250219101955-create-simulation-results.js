'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SimulationResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      totalMonthlyRevenue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Revenu mensuel total nécessaire'
      },
      totalVitalCharges: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total des charges vitales'
      },
      totalComfortCharges: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total des charges de confort'
      },
      totalOperatingCharges: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total des charges professionnelles'
      },
      iterativeChargesResults: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Résultats charges par période (array JSON)'
      },
      iterativeRevenueResults: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Résultats revenus par période (array JSON)'
      },
      iterativeSocialChargesResults: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Résultats charges sociales par période (array JSON)'
      },
      finalNetRevenue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Revenu net final calculé'
      },
      finalGrossRevenue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Revenu brut final calculé'
      },
      simulationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Simulations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Référence vers la simulation (relation 1:1)'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Index unique sur simulationId pour garantir la relation 1:1
    await queryInterface.addIndex('SimulationResults', ['simulationId'], {
      unique: true,
      name: 'simulation_results_simulation_id_unique_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('SimulationResults', 'simulation_results_simulation_id_unique_idx');
    await queryInterface.dropTable('SimulationResults');
  }
}; 