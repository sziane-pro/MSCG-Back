export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Suppl_Data', {
    id_Suppl_Data: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    val: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    nNumLigne: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date_Appli: {
      type: Sequelize.DATE,
      allowNull: false,
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
  await queryInterface.dropTable('Suppl_Data');
} 