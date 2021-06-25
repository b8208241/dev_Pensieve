'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifications_unit = sequelize.define('notifications_unit', {
    id_receiver: DataTypes.INTEGER,
    id_unit: DataTypes.UUID,
    event_type: DataTypes.TEXT('tiny'),
    type_textparams: DataTypes.STRING,
    read: DataTypes.BOOLEAN,
    clicked: DataTypes.BOOLEAN
  }, {});
  notifications_unit.associate = function(models) {
    notifications_unit.belongsTo(models.units, {
      foreignKey: "id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    notifications_unit.belongsTo(models.users, {
      foreignKey: "id_receiver",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  notifications_unit.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.

  return notifications_unit;
};