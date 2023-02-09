const { ApplicationCommandTypes } = require('oceanic.js');

const cmd = {
    name: 'ping',
    description: 'pong',
    type: ApplicationCommandTypes.CHAT_INPUT,
    run: async (interaction) => {
        await interaction.createMessage({content: "pong!"});
    }
}

module.exports = cmd;