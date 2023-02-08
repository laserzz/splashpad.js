const { SplashpadClient } = require('splashpad.js');
const { ComponentTypes, ButtonStyles } = require('oceanic.js');

const bot = new SplashpadClient({auth: "Bot TOKEN"});

bot.addComponentCommand({
    customID: 'my-btn',
    run: async (interaction) => {
        await interaction.createMessage({content: "hello!"});
    }
});

bot.addCommand({
    name: 'button',
    description: 'display a button!',
    type: 1,
    run: async (interaction) => {
        await interaction.createMessage({
            components: [
                {
                    type: ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: ComponentTypes.BUTTON,
                            style: ButtonStyles.PRIMARY,
                            customID: 'my-btn',
                            label: 'Click Me!'
                        }
                    ]
                }
            ]
        })
    }
});

bot.initialize();