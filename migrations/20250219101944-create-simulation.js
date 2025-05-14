export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Simulations', {
    id_Simulation: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CA_HT: {
      type: Sequelize.FLOAT,
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
  await queryInterface.dropTable('Simulations');
} 