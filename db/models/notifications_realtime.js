'use strict';
module.exports = (sequelize, DataTypes) => {
  const notifications_realtime = sequelize.define('notifications_realtime', {
    id_receiver: DataTypes.INTEGER,
    id_unit: DataTypes.UUID,
    event_type: DataTypes.TEXT('tiny'),
    type_textparams: DataTypes.STRING,
    displayed: DataTypes.BOOLEAN
  }, {});
  notifications_realtime.associate = function(models) {
    notifications_realtime.belongsTo(models.units, {
      foreignKey: "id_unit",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    notifications_realtime.belongsTo(models.users, {
      foreignKey: "id_receiver",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  notifications_realtime.removeAttribute('id'); //this model do not use 'id' nor any pk, so we need to tell it.
  return notifications_realtime;
};