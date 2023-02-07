import { ApplicationCommandTypes, LocaleMap, ClientEvents, CommandInteraction } from "oceanic.js";

export interface CommandOptions {
    name: string;
    name_localizations?: any;
    description: string;
    description_localizations?: any;
    type: typeof ApplicationCommandTypes;
    options: CommandOptionOptions[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    nsfw?: boolean;
    run?: Function;
}

export interface ComponentCommandOptions {
    customID: string;
    run: Function;
}

export interface CommandOptionOptions {
    name: string;
    name_localizations?: any;
    description: string;
    description_localizations?: any;
    required?: boolean;
    choices?: CommandChoiceOptions[];
    run?: Function;
}

interface CommandChoiceOptions {
    name: string;
    name_localizations?: LocaleMap;
    value: string | number;
}

export interface EventOptions {
    name: keyof ClientEvents;
    run: Function;
}