'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SimulationParameters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timeHorizon: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Horizon temporel en mois'
      },
      adjustmentPeriod: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Période d\'ajustement en mois'
      },
      growthRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Taux de croissance en pourcentage'
      },
      coefficient: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Coefficient multiplicateur'
      },
      socialChargesRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Taux charges sociales en pourcentage'
      },
      socialChargesMaxBase: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Assiette maximale charges sociales'
      },
      microBrutMarginRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Taux marge brute micro en pourcentage'
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
    await queryInterface.addIndex('SimulationParameters', ['simulationId'], {
      unique: true,
      name: 'simulation_parameters_simulation_id_unique_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('SimulationParameters', 'simulation_parameters_simulation_id_unique_idx');
    await queryInterface.dropTable('SimulationParameters');
  }
}; 