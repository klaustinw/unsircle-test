'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      username: "admin",
      password: "$2a$10$158.iH6MwfMvWn1Nlem/fuENLk.3ryQiFtsrinm/Qbh8DhLhmbRDa", // password: "123456"
      privilege: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
