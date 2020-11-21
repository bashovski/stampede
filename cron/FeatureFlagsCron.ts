import { cron } from '../deps.ts';
import Logger from '../lib/Logger.ts';
import FeatureFlagReader from "../lib/FeatureFlagReader.ts";
import FeatureFlags from "../lib/FeatureFlags.ts";

/**
 * @summary A Cron job which reloads feature flags.
 */
class SessionsCron {
    public static async schedule(): Promise<any> {

        if (!FeatureFlags.isFeatureEnabled('checkForChanges'))
            return Logger.debug('Feature flag checks are disabled. Skipping the CRON Job scheduling...');

        return cron('0 * * * * *', async () => {
            await FeatureFlagReader.readAll();
        });
    }
}

export default SessionsCron;
