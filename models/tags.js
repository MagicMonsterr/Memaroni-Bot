const { DataTypes } = require('sequelize');

//Creates tags for database
module.exports = (sequelize) => {
	const Tags = sequelize.define('tags', {
		name: {
			type: DataTypes.STRING,
			unique:true,
		},
		time: { 
			type: DataTypes.TEXT,
			defaultValue: 0,
			allowNull: false,
		},
	},
	{
			freezeTableName: true
	});
	return Tags
};