const { SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Tokens = require(`../../models/tokens`)(sequelize);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tokenbalance')
        .setDescription('Shows your token balance.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The person whose balance you want (leave blank to get own balance)')
                .setRequired(false)),
        async execute(interaction) {
            let person = null;
            if(interaction.options.getUser('user') === null){
                person = interaction.user.username;
            } else {
                person = interaction.options.getUser('user').username;
            }
            try {
                const token = await Tokens.findOne({ where: { name: person } });
                if(token === null){
                    await interaction.reply(person + 'has not been added to the token database');
                } else {
                    const balance = token.get('amount');
                    if (balance === 1){
                        await interaction.reply(person + ' has ' + balance + ' token.')
                    } else {
                        await interaction.reply(person + ' has ' + balance + ' tokens.')
                    }
                }
            } catch (error) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
}