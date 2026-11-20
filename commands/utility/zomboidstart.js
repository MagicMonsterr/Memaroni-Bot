const { SlashCommandBuilder } = require('discord.js');

const { execFile } = require('child_process');

function startPZServer() {
    return new Promise((resolve, reject) => {
        execFile(
            'sudo',
            ['/usr/local/sbin/start-pzserver'],
            (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }

                resolve(stdout.trim());
            }
        );
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setname('zomboidstart')
        .setDescription('Starts the zomboid server'),
        async execute(interaction) {
        await interaction.deferReply();
        try {
            const result = await startPZServer();
            
            await interaction.followUp(result);
        } catch (error) {
            console.error(error)
            
            await interaction.followUp('Failed to start Zomboid server')
        }
        },
}
