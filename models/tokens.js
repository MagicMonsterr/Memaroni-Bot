const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Tokens = sequelize.define('tokens', {
		name: {
			type: DataTypes.STRING,
			unique:true,
		},
		amount: { 
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: false,
		},
	},
	{
			freezeTableName: true
	});
	return Tokens;
};