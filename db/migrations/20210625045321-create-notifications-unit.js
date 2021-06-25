'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications_unit', {
      id_receiver: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false
      },
      id_unit: {
        type: Sequelize.UUID,
        allowNull: false
      },
      event_type: {
        type: Sequelize.TEXT('tiny'),
        allowNull: false
      },
      type_textparams: {
        type: Sequelize.STRING
      },
      read: {
        type: Sequelize.BOOLEAN
      },
      clicked: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(() => {
      return queryInterface.addConstraint('notifications_unit', ['id_receiver'], {
        type: 'foreign key',
        name: 'constraint_fkey_notisUnit_idreceiver',
        references: { //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    }).then(() => {
      return queryInterface.addConstraint('notifications_unit', ['id_unit'], {
        type: 'foreign key',
        name: 'constraint_fkey_notisUnit_idunit',
        references: { //Required field
          table: 'units',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notifications_unit');
  }
};