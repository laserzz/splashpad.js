const { SplashpadClient } = require('splashpad.js');

const bot = new SplashpadClient({auth: "Bot TOKEN"});

bot.addCommandDir(path.join(__dirname, 'commands'));

bot.initialize();