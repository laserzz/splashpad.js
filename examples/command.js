const { SplashpadClient } = require('splashpad.js');
const { ApplicationCommandTypes } = require('oceanic.js');

const bot = new SplashpadClient({auth: "Bot TOKEN"});

bot.subscribe({
    name: 'ready',
    run: async () => { console.log('up and running!'); }  
});

bot.addCommand({
    name: 'ping',
    description: 'pong',
    type: ApplicationCommandTypes.CHAT_INPUT,
    run: async (interaction) => {
        await interaction.createMessage({content: "pong!"});
    }
});

bot.initialize();