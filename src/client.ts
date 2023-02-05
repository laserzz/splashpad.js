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
                let name = interaction.data.name
                await this.handleCommand(name, interaction);
            }
        });
    }

    async handleCommand(commandName: String, interaction: CommandInteraction) {
        const cmd = this.commands.find(c => c.name == commandName);
        if(!cmd) {
            await interaction.createMessage({content: "Command not found."});
            return;
        }
        await cmd.run(interaction);
    }

    addCommand(command: CommandOptions) {
        this.commands.push(command);
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