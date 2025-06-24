'use strict';
import bcrypt from 'bcryptjs';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        email: 'test@mscg.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'demo@mscg.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Récupérer l'ID de l'utilisateur de test
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = \'test@mscg.com\'',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const userId = users[0].id;

    // Créer des simulations de test qui correspondent au frontend
    await queryInterface.bulkInsert('Simulations', [
      {
        nom: 'Simulation A',
        statut: 'Terminée',
        ca: '12 000 €',
        revenuNet: '8 400 €',
        userId: userId,
        createdAt: new Date('2024-05-01'),
        updatedAt: new Date('2024-05-01')
      },
      {
        nom: 'Simulation B',
        statut: 'En cours',
        ca: '8 500 €',
        revenuNet: '5 300 €',
        userId: userId,
        createdAt: new Date('2024-05-12'),
        updatedAt: new Date('2024-05-12')
      },
      {
        nom: 'Analyse Micro-Entreprise 2024',
        statut: 'Terminée',
        ca: '25 000 €',
        revenuNet: '18 750 €',
        userId: userId,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      },
      {
        nom: 'Projection Q2 2024',
        statut: 'Brouillon',
        ca: '15 000 €',
        revenuNet: '11 200 €',
        userId: userId,
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date('2024-04-20')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Simulations', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
}; 