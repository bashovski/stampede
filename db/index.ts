import { Database } from 'https://deno.land/x/denodb/mod.ts';
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
