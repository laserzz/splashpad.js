const { SplashpadClient } = require('splashpad.js');

const bot = new SplashpadClient({auth: "Bot TOKEN"});

bot.addCommand({
    name: 'parent',
    description: 'parent command',
    type: 1
});

bot.addSubCommand({
    name: 'child',
    description: 'child command',
    type: 1,
    run: async (interaction) => {
        await interaction.createMessage({content: `child command!`});
    }
}, 'parent');

bot.initialize();