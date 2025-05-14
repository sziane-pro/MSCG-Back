export async function up(queryInterface, Sequelize) {
  // User_Possess_Society
  await queryInterface.createTable('User_Possess_Society', {
    UserId: {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id_User' },
      onDelete: 'CASCADE',
    },
    SocietyId: {
      type: Sequelize.INTEGER,
      references: { model: 'Societys', key: 'id_Society' },
      onDelete: 'CASCADE',
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

  // User_Concil_Society
  await queryInterface.createTable('User_Concil_Society', {
    UserId: {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id_User' },
      onDelete: 'CASCADE',
    },
    SocietyId: {
      type: Sequelize.INTEGER,
      references: { model: 'Societys', key: 'id_Society' },
      onDelete: 'CASCADE',
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

  // Society_Has_Exercice
  await queryInterface.createTable('Society_Has_Exercice', {
    SocietyId: {
      type: Sequelize.INTEGER,
      references: { model: 'Societys', key: 'id_Society' },
      onDelete: 'CASCADE',
    },
    ExerciceId: {
      type: Sequelize.INTEGER,
      references: { model: 'Exercices', key: 'id_Exercice' },
      onDelete: 'CASCADE',
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

  // Exercice_Possess_Simulation
  await queryInterface.createTable('Exercice_Possess_Simulation', {
    ExerciceId: {
      type: Sequelize.INTEGER,
      references: { model: 'Exercices', key: 'id_Exercice' },
      onDelete: 'CASCADE',
    },
    SimulationId: {
      type: Sequelize.INTEGER,
      references: { model: 'Simulations', key: 'id_Simulation' },
      onDelete: 'CASCADE',
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

  // Simulation_with_status
  await queryInterface.createTable('Simulation_with_status', {
    SimulationId: {
      type: Sequelize.INTEGER,
      references: { model: 'Simulations', key: 'id_Simulation' },
      onDelete: 'CASCADE',
    },
    JuryStatusId: {
      type: Sequelize.INTEGER,
      references: { model: 'Jury_Statuses', key: 'id_Jury_Status' },
      onDelete: 'CASCADE',
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

  // Simulation_Possess_Data
  await queryInterface.createTable('Simulation_Possess_Data', {
    SimulationId: {
      type: Sequelize.INTEGER,
      references: { model: 'Simulations', key: 'id_Simulation' },
      onDelete: 'CASCADE',
    },
    SupplDataId: {
      type: Sequelize.INTEGER,
      references: { model: 'Suppl_Data', key: 'id_Suppl_Data' },
      onDelete: 'CASCADE',
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

  // User_Possess_Chiffre
  await queryInterface.createTable('User_Possess_Chiffre', {
    UserId: {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id_User' },
      onDelete: 'CASCADE',
    },
    SupplDataId: {
      type: Sequelize.INTEGER,
      references: { model: 'Suppl_Data', key: 'id_Suppl_Data' },
      onDelete: 'CASCADE',
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
  await queryInterface.dropTable('User_Possess_Society');
  await queryInterface.dropTable('User_Concil_Society');
  await queryInterface.dropTable('Society_Has_Exercice');
  await queryInterface.dropTable('Exercice_Possess_Simulation');
  await queryInterface.dropTable('Simulation_with_status');
  await queryInterface.dropTable('Simulation_Possess_Data');
  await queryInterface.dropTable('User_Possess_Chiffre');
} 