import { faker } from '@faker-js/faker';

export async function up(queryInterface, Sequelize) {
  const exercices = [];
  
  // Générer 10 exercices
  for (let i = 0; i < 10; i++) {
    const startDate = faker.date.future();
    const endDate = faker.date.between({ from: startDate, to: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) }); // End date within 30 days of start date
    
    exercices.push({
      name: faker.company.name(),
      numero: faker.string.numeric(4),
      date_Start: startDate,
      date_End: endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  await queryInterface.bulkInsert('Exercices', exercices, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Exercices', null, {});
} 