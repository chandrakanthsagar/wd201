"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Todos", "UserId", {
      type: Sequelize.DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("Todos", {
      fields: ["userId"],
      type: "foreign key",
      references: {
        table: "USers",
        field: "id",
      },
    });
    /**
     * Add altering comm(ands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Todos", "userId");
  },
};
