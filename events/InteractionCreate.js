const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        //Filters out non slash commands
		if (!interaction.isChatInputCommand()) return;

        //Gets the matching command from the "client.commands" collection (declared earlier) based on "interaction.commandName" which is the name of the command (ping.js, etc.)
		const command = interaction.client.commands.get(interaction.commandName);

        //If no command matching the name exists log error
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

	    //Try to execute command
		try {
			await command.execute(interaction);
        //If code errors log error
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};