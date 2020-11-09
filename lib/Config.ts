import ConfigLoader from './ConfigLoader.ts';

class Config {
    configVars: any;

    public async init() {
        this.configVars = await ConfigLoader.loadEnvironmentVariables();
        this.generateAccessors();
    }

    get(configVar: string): any {
        return Object.prototype.hasOwnProperty.call(this.configVars, configVar)
            ? this.configVars[configVar]
            : null;
    }

    generateAccessors() {
        for(const configVar in this.configVars) {
            // @ts-ignore
            this[`get${configVar.charAt(0).toUpperCase() + configVar.slice(1)}`] = () => this.configVars[configVar];
        }
    }
}

const config : any = new Config();
await config.init();

export default config;
