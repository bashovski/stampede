import { log } from '../deps.ts';
import Config from './Config.ts';
import FeatureFlags from "./FeatureFlags.ts";

const logLevelIcons: any = {
    DEBUG: '🛡',
    INFO: 'ℹ️',
    WARNING: '⚠️',
    ERROR: '❗️',
    CRITICAL: '‼️'
};

/**
 * @summary Base body for log request. Initially made to work with Datadog logs.
 *          It is advisable to use one of those services: Datadog, Sentry, Elk Stack.
 *          Instrumentation is one of the most crucial parts of every server, platform, etc.
 */
const baseLogBody = {
    ddsource: 'stampede-server',
    ddtags: `env:${Config.getEnvironment()},domain:${Config.getApiUrl()}`
}

/**
 * @summary Sends log through by HTTP request to 3rd party service
 * @param message
 * @param facets
 */
const persistLog = (message: string, facets: any) => {

    try {
        const body = {
            ...baseLogBody,
            message,
            ...facets
        };

        if (!FeatureFlags.isFeatureEnabled('datadogEnabled'))
            return;

        // Shouldn't be asynchronous as awaiting Datadog's response is irrelevant in this case
        return fetch('https://http-intake.logs.datadoghq.com/v1/input', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'DD-API-KEY': Config.getDatadogKey()
            },
            body: JSON.stringify(body)
        }).catch(err => {
            console.log(err);
        });
    } catch(e) {
        console.log(e);
    }
}

/**
 * @summary Logger configuration
 */
await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler('DEBUG', {
            formatter: (logRecord: any) => {
                const facets = logRecord.args;
                persistLog(logRecord.msg, facets);
                return `${logLevelIcons[logRecord.levelName]} [${logRecord.levelName}]: \x1b[37m${logRecord.msg}`;
            }
        })
    },

    loggers: {
        default: {
            level: 'DEBUG',
            handlers: ['console'],
        },
    },
});

const Logger = log.getLogger();

export default Logger;
