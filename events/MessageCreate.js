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
const Tokens = require(`../models/tokens`)(sequelize);

module.exports = {
    name: Events.MessageCreate,
    async execute(message){
        if((message.author.id) === (jakeId)){
            let date = new Date();
            let today = date.getDate() + '/' + (date.getMonth()) + '/' + date.getFullYear();
            Tags.update({ time: today }, {where: { name: 'jakeTime' } });
         }

        if(message.content.at(0) === '+' && /\d/.test(message.content.at(1))){
            try{
                let index = null;
                const reciever = message.mentions.users.first().username;
		for(let i = 1; i < message.content.length; i++){
                    if(!(/\d/.test(message.content.at(i)))){
                        if(!(message.content.at(i) === '.')){
                            index = i;
                            break;
                        }
                    }
                }

                const newTokens = parseFloat(message.content.substring(1, index));
                const tokenReciever = await Tokens.findOne({ where: { name: reciever }});
                const tokenGiver = await Tokens.findOne({ where: { name: message.author.username } })
                let recieverTokens = null;
                let giverTokens = null;

                if(!(tokenReciever === null || tokenGiver === null)){
                    recieverTokens = tokenReciever.get('amount');
                    giverTokens = tokenGiver.get('amount');
                    Tokens.update({ amount: recieverTokens+newTokens }, {where: {name: reciever }})
                    Tokens.update({ amount: giverTokens-newTokens }, {where: {name: message.author.username}})
                } else if (tokenReciever === null) {
                    giverTokens = tokenGiver.get('amount');
                    await Tokens.create({
                        name: reciever,
                        amount: newTokens + 10,
                    });
                    Tokens.update({ amount: giverTokens-newTokens }, {where: {name: message.author.username}})
                } else if (tokenGiver === null){
                    recieverTokens = tokenReciever.get('amount');
                    await Tokens.create({
                        name: message.author.username,
                        amount: 10 - newTokens,
                    });
                    Tokens.update({ amount: recieverTokens+newTokens }, {where: {name: reciever }})
                }
            } catch (error) {
	       if(error.name === 'TypeError'){
	       } else {
               	message.channel.send('There was an error adding the tokens');
               	console.error(error);
	       }
            }
        }
    }
}
