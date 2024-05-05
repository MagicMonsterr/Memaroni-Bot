const { SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Tags = require(`../../models/tags`)(sequelize);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schizotime')
        .setDescription('Shows the last time Jacob Ryan Moss was active'),
        async execute(interaction) {
            //Gives 15 mins for bot to respond
            await interaction.deferReply();
            try {
                //Finds the row that contains in the "name" column that is called jakeTime
                const tag = await Tags.findOne({where: { name: 'jakeTime' } });

                //If the tag is found run this to calculate days since Jake has sent a message
                if (tag === null){
                    return interaction.followUp('Could not find command');
                } else {
                    const newDate = new Date();
                    let oldTime = tag.get('time');

                    const oldDay = oldTime.substring(0, oldTime.indexOf('/'));
                    oldTime = oldTime.substring(oldTime.indexOf('/') + 1);
                    const oldMonth = oldTime.substring(0, oldTime.indexOf('/'));
                    oldTime = oldTime.substring(oldTime.indexOf('/') + 1);
                    const oldYear = oldTime.substring(0);

                    const oneDay = 24 * 60 * 60 * 1000;
                    const firstDate = new Date(oldYear, oldMonth, oldDay);

                    let diffDays = null;
                    if(firstDate.toDateString() === newDate.toDateString()){
                        diffDays = 0;
                    } else {
                        diffDays = (Math.round(Math.abs((newDate - firstDate) / oneDay))) - 1;
                    }

                    if(diffDays === null){
                        //Return error if tag could not be found
                        await interaction.followUp('Could not find timestamp');
                    }
                    if(diffDays === 1){
                        await interaction.followUp('It has been ' + diffDays.toString() + ' day since Jake has appeared');
                    } else {
                        await interaction.followUp('It has been ' + diffDays.toString() + ' days since Jake has appeared');
                    }
                }
            } catch (error) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        },
};