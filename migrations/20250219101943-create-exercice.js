export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Exercices', {
    id_Exercice: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    numero: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date_Start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    date_End: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Exercices');
} 