const { SplashpadClient } = require('splashpad.js');

const bot = new SplashpadClient({auth: "Bot TOKEN"});

bot.subscribe({
    name: 'ready',
    run: async () => { console.log('up and running!'); }  
});

bot.initialize();