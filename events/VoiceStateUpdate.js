const { Events } = require('discord.js');
const Sequelize = require('sequelize');
const { jakeId } = require('../config.json')

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = require(`../models/tags`)(sequelize);

module.exports = {
    name: Events.VoiceStateUpdate,
    execute(oldUser, newUser){
        if(newUser.member.id === jakeId){
            let date = new Date();
            let today = date.getDate() + '/' + (date.getMonth()) + '/' + date.getFullYear();
            Tags.update({ time: today }, {where: { name: 'jakeTime' } });
        }
    }
}