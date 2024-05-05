const { Events } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = require(`../models/tags`)(sequelize);

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        Tags.sync();
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
}