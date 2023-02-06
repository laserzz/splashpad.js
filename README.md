# splashpad.js

**A lightweight command framework for Oceanic.**

#### Quick Example

```js
const { SplashpadClient } = require('splashpad.js');

const bot = new SplashpadClient({auth: "Bot TOKEN"});

bot.subscribe({
    name: 'ready',
    run: async () => { console.log('up and running!'); }  
});

bot.initialize();
```

More examples can be found in the [examples](https://github.com/laserzz/splashpad.js/tree/master/examples) folder.

#### Resources

[NPM Package](https://www.npmjs.com/package/splashpad.js)\
[Oceanic](https://github.com/OceanicJS/Oceanic)