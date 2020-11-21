import { cron } from '../deps.ts';
import Session from '../models/Session.ts';
import Logger from '../lib/Logger.ts';
import Db from '../db/index.ts';
import FeatureFlags from "../lib/FeatureFlags.ts";

/**
 * @summary A Cron job which purges all expired user sessions.
 *          Its interval doesn't have to be short, as its role is relatively trivial,
 *          but significant for complex systems.
 */
class SessionsCron {
    public static async schedule(): Promise<any> {

        if (!FeatureFlags.isFeatureEnabled('clearSessions')) return;

        return cron('0 0 0 * * *', async () => {
            Logger.info('Purging expired sessions...');
            await Session.where('expires_at', '<', Db.now()).delete();
        });
    }
}

export default SessionsCron;
