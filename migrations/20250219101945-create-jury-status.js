export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Jury_Statuses', {
    id_Jury_Status: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    factor_1: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    factor_2: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    factor_3: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    factor_4: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    factor_5: {
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
  await queryInterface.dropTable('Jury_Statuses');
} 