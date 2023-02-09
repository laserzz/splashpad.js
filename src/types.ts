import { 
    ApplicationCommandTypes, 
    LocaleMap, 
    ClientEvents, 
    CommandInteraction, 
    ApplicationCommandOptionTypes,
    ComponentInteraction
} from "oceanic.js";

export interface CommandOptions {
    name: string;
    name_localizations?: any;
    description: string;
    description_localizations?: any;
    type: ApplicationCommandTypes;
    options?: CommandOptionOptions[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    nsfw?: boolean;
    run?: (interaction: CommandInteraction) => Promise<any>;
}

export interface ComponentCommandOptions {
    customID: string;
    run: (interaction: ComponentInteraction) => Promise<any>;
}

export interface CommandOptionOptions {
    name: string;
    name_localizations?: any;
    type: ApplicationCommandOptionTypes;
    description: string;
    description_localizations?: any;
    required?: boolean;
    choices?: CommandChoiceOptions[];
    run?: (interaction: CommandInteraction) => Promise<any>;
}

interface CommandChoiceOptions {
    name: string;
    name_localizations?: LocaleMap;
    value: string | number;
}

export interface EventOptions {
    name: keyof ClientEvents;
    run: Function
}