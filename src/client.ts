import { Client, Routes, CommandInteraction } from "oceanic.js";
import { EventOptions, CommandOptions } from "./types";

export class SplashpadClient extends Client {
    events: EventOptions[] = [];
    commands: CommandOptions[] = [];

    async syncCommands() {
        await this.rest.authRequest({ method: "PUT", headers: { 'Content-Type': 'application/json' }, json: this.commands, path: Routes.APPLICATION_COMMANDS(this.user.id) });
    }

    async initialize() {
        this.eventListen();
        this.connect();
        this.on('ready', async () => { await this.syncCommands() });
        this.on('interactionCreate', async (interaction) => {
            if(interaction instanceof CommandInteraction) {
                let name = interaction.data.name;
                await this.handleCommand(name, interaction);
            }
        });
    }

    async handleCommand(commandName: String, interaction: CommandInteraction) {
        const cmd = this.commands.find(c => c.name == commandName);
        if(interaction.data.options.raw) {
            if(interaction.data.options.raw[0].type == 1) {
                const subcmd = cmd.options.find(o => o.name == interaction.data.options.raw[0].name);
                await subcmd.run(interaction);
                return;
            }
        }
        if(!cmd) {
            await interaction.createMessage({content: "Command not found."});
            return;
        }
        await cmd.run(interaction);
    }

    addCommand(command: CommandOptions) {
        this.commands.push(command);
    }

    addSubCommand(command: CommandOptions, parentCommandName: string) {
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

    subscribe(event: EventOptions) {
        this.events.push(event);
    }

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