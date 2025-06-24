'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OperatingCharges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nom de la charge professionnelle'
      },
      monthlyAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Montant mensuel de la charge'
      },
      simulationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Simulations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Référence vers la simulation'
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

    // Index sur simulationId pour les requêtes de récupération
    await queryInterface.addIndex('OperatingCharges', ['simulationId'], {
      name: 'operating_charges_simulation_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('OperatingCharges', 'operating_charges_simulation_id_idx');
    await queryInterface.dropTable('OperatingCharges');
  }
}; 