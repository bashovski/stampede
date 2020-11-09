import { config } from "https://deno.land/x/dotenv/mod.ts";
import Loader from './Loader.ts';
import Logger from "./Logger.ts";

class ConfigLoader extends Loader {
    static async loadEnvironmentVariables(): Promise<Object> {

        const configObj = { ...Deno.env.toObject(), ...config() };

        const modules: Array<any> = await super.loadModules('./config');

        /**
         * Merge all config/env vars into a single object
         */
        let mergedConfigVars : any = {};
        for (const module of modules) {
            mergedConfigVars = { ...mergedConfigVars, ...module.default };
        }

        /**
         * Define environment variables
         * @todo improve throw reason
         */
        let envVars : any = {};
        for(const configVarKey in mergedConfigVars) {

            if (!configObj[mergedConfigVars[configVarKey]]) {
                console.log(`Env variable for ${configVarKey} is missing, several functionalities may not work.`);
                envVars[configVarKey] = undefined;
                continue;
            }

            envVars[configVarKey] = configObj[mergedConfigVars[configVarKey]];
        }

        return envVars;
    }
}

export default ConfigLoader;
