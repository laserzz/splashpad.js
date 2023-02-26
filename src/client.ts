import { Client, Routes, CommandInteraction, ComponentInteraction, ApplicationCommandTypes } from "oceanic.js";
import { EventOptions, CommandOptions, CommandOptionOptions, ComponentCommandOptions } from "./types";
import fs from 'fs';
import path from 'path';

export class SplashpadClient extends Client {
    events: EventOptions[] = [];
    commands: CommandOptions[] = [];
    componentCommands: ComponentCommandOptions[] = [];

    async syncCommands() {
        await this.rest.authRequest({ method: "PUT", headers: { 'Content-Type': 'application/json' }, json: this.commands, path: Routes.APPLICATION_COMMANDS(this.user.id) });
    }

    /**
    * Connects the bot and sets up listeners. Use this instead of the connect() method, else unexpected behaviour will occur.
    */
    async initialize() {
        this.eventListen();
        this.connect();
        this.on('ready', async () => { await this.syncCommands() });
        this.on('interactionCreate', async (interaction) => {
            if(interaction instanceof CommandInteraction) {
                let name = interaction.data.name;
                await this.handleCommand(name, interaction);
                return;
            }
            if(interaction instanceof ComponentInteraction) {
                await this.handleComponentCommand(interaction);
                return;
            }
        });
    }

    /**
     * Used internally; Highly recommended you don't call this method.
     */
    async handleCommand(commandName: String, interaction: CommandInteraction) {
        const cmd = this.commands.find(c => c.name == commandName);
        if(!cmd) {
            await interaction.createMessage({content: "Command not found."});
            return;
        }
        if(interaction.data.options.raw[0]) {
            if(interaction.data.options.raw[0].type == 1) {
                const subcmd = cmd.options.find(o => o.name == interaction.data.options.raw[0].name);
                await subcmd.run(interaction);
                return;
            }
        }
        await cmd.run(interaction);
    }

    /**
     * Used internally; Highly recommended you don't call this method.
     */
    async handleComponentCommand(interaction: ComponentInteraction) {
        const cmd = this.componentCommands.find(c => c.customID == interaction.data.customID);
        if(!cmd) {
            await interaction.createMessage({content: "Command not found."});
            return;
        }
        await cmd.run(interaction);
    }

    /**
     * Adds a command to the list.
     * 
     * @param command {CommandOptions} Command Object to add.
     */
    addCommand(command: CommandOptions) {
        this.commands.push(command);
    }

    /**
     * Adds a subcommand to a parent command.
     * 
     * @param command {CommandOptions} Command Object to add.
     * @param parentCommandName {string} Name of the parent command.
     * 
     * @throws {Error} If the parent command does not exist.
     */
    addSubCommand(command: CommandOptionOptions, parentCommandName: string) {
        try {
            let cmd = this.commands.find(c => c.name == parentCommandName);
            if(!cmd.options) {
                cmd.options = [command];
            } else {
                cmd.options.push(command);
            }
        } catch (e) {
            throw new Error("No parent command found by that name.");
        }
    }

    /**
     * Adds a callback for a specific component.
     * 
     * @param command {CommandOptions} Command Object to add.
     */
    addComponentCommand(command: ComponentCommandOptions) {
        this.componentCommands.push(command);
    }

    /**
     * Allows you to add commands in bulk if you would prefer to.
     * 
     * @param commands {CommandOptions[]} Commands to add.
     */
    bulkAddCommands(commands: CommandOptions[]) {
        for(const c of commands) {
            this.addCommand(c);
        }
    }

    /**
     * automates the creation of multiple commands via multiple files.\
     * The CommandOptions Object must be the default export for this function to work.
     * 
     * @param path {string} path to search for files.
     */
    addCommandDir(filePath: string) {
        const files = fs.readdirSync(filePath);
        for(const f of files) {
            if(f == path.basename(__filename)) {
                continue;
            }
            let cmd = require(`${filePath}/${f}`);
            if(cmd.default) {
                cmd = cmd.default;
            }
            this.addCommand(cmd);
        }
    }

    /**
     * Automates the creation of a help command.
     */
    helpCommand() {
        let helpStr = "";
        for(const c of this.commands) {
            if(c.options) {
                if(c.options[0].type == 1) {
                    for(const sc of c.options) {
                        helpStr += `**${c.name} ${sc.name}** - ${sc.description}\n`;
                    }
                    continue;
                }
            }
            helpStr += `**${c.name}** - ${c.description}\n`;
        }
        let embed = {
            title: `Commands`,
            description: helpStr
        }
        this.addCommand({
            name: 'help',
            description: 'help commands',
            type: ApplicationCommandTypes.CHAT_INPUT,
            run: async (interaction) => {
                await interaction.createMessage({embeds: [embed]});
            }
        });
    }

    /**
     * Sets an event to listen for, with a callback.\
     * Alternatively, you can use the default listener function with on().
     * 
     * @param event {EventOptions} Event to listen for.
     */
    subscribe(event: EventOptions) {
        this.events.push(event);
    }

    /**
     * automates the creation of event callbacks via multiple files.\
     * the default file export must be an EventOptions object for this to work.
     * 
     * @param filePath path to search for files.
     */
    addEventDir(filePath: string) {
        const files = fs.readdirSync(filePath);
        for(const f of files) {
            if(f == path.basename(__filename)) {
                continue;
            }
            let event = require(`${filePath}/${f}`);
            if(event.default) {
                event = {name: event.default.name, run: event.default.run};
            }
            this.subscribe(event);
        }
    }

    /**
     * Used internally; Highly recommended you don't call this method.
     */
    private eventListen() {
        try {
            for (const e of this.events) {
                this.on(e.name, (...args: any[]) => e.run(this, ...args));
            }
        } catch (e) {
            console.error(e);
        }
    }
}