import { Client, Routes } from "oceanic.js";
import { EventOptions, CommandOptions } from "./types";

export class SplashpadClient extends Client {
    events: EventOptions[] = [];
    commands: CommandOptions[] = [];

    async syncCommands() {
        let stripped = this.stripCommands();
        await this.rest.authRequest({ method: "PUT", headers: { 'Content-Type': 'application/json' }, json: stripped, path: Routes.APPLICATION_COMMANDS(this.user.id) });
    }

    async initialize() {
        this.eventListen();
        this.connect();
        this.on('ready', async () => { await this.syncCommands() });
    }

    addCommand(command: CommandOptions) {
        this.commands.push(command);
    }

    subscribe(event: EventOptions) {
        this.events.push(event);
    }

    stripCommands(): any[] {
        let stripped = [];
        for (let command of this.commands) {
            let nc = command;
            delete nc.run;
            stripped.push(nc);
        }

        return stripped;
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