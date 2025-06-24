'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CategoriBudgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nom de la catégorie budgétaire'
      },
      monthlyAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Montant mensuel de la catégorie'
      },
      categoryType: {
        type: Sequelize.ENUM('vital', 'confort'),
        allowNull: false,
        comment: 'Type de catégorie: vital ou confort'
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
    await queryInterface.addIndex('CategoriBudgets', ['simulationId'], {
      name: 'categori_budgets_simulation_id_idx'
    });

    // Index sur categoryType pour filtrer par type
    await queryInterface.addIndex('CategoriBudgets', ['categoryType'], {
      name: 'categori_budgets_category_type_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('CategoriBudgets', 'categori_budgets_simulation_id_idx');
    await queryInterface.removeIndex('CategoriBudgets', 'categori_budgets_category_type_idx');
    await queryInterface.dropTable('CategoriBudgets');
  }
}; 