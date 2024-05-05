const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

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

Tags.sync();

Tags.destroy({ where: { name: 'two' } });