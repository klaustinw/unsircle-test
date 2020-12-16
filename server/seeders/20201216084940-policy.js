'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('policies', [{
      name: 'admin',
      add_permit: true,
      del_permit: true,
      update_permit: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user1',
      add_permit: true,
      del_permit: false,
      update_permit: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'user2',
      add_permit: false,
      del_permit: true,
      update_permit: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('policies', null, {});
  }
};
