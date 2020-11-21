import { Database } from 'https://raw.githubusercontent.com/eveningkid/denodb/abed3063dd92436ceb4f124227daee5ee6604b2d/mod.ts';
import FeatureFlags from '../lib/FeatureFlags.ts';
import Config from '../lib/Config.ts';

/**
 * @summary Db represents a class which assures the connection to a PostgreSQL is made.
 * @class Db
 */
class Db extends Database {
    constructor({ debug = false }) {
        const dbOptions : any = {
            host : Config.get('dbHost'),
            username: Config.getDbUsername(),
            password: Config.getDbPassword(),
            database: Config.getDbName()
        };

        if (FeatureFlags.isFeatureEnabled('runMigrationsOnBoot')) {
            const cmd = Deno.run({
                cmd: ['./scripts/migrate']
            });
        }

        // @ts-ignore
        super({ dialect: 'postgres', debug }, dbOptions);
    }

    static now() {
        return 'NOW()';
    }
}

export default Db;
