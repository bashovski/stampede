import Db from '../../db/index.ts';
import ModelLoader from '../../lib/ModelLoader.ts';

/**
 * @summary Bootstraps the database for tests.
 *          Note that the connection has to be closed to avoid resources leak.
 */
export default async (): Promise<Db> => {
    const db = new Db({ debug: false });
    const models = await ModelLoader.loadDbModels();
    await db.link(models);
    return db;
};
