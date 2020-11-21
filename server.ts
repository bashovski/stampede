/**
 * @summary Boots up the server, initializes and loads every required module in order to assure server functions normally.
 */

import Db from './db/index.ts';
import Config from './lib/Config.ts';
import Router from './lib/Router.ts';
import Logger from './lib/Logger.ts';
import CronLoader from './lib/CronLoader.ts';
import ModelLoader from './lib/ModelLoader.ts';
import RouteLoader from './lib/RouteLoader.ts';
import HttpOriginReader from './http/HttpOriginReader.ts';
import { Application } from './deps.ts';
import FeatureFlagReader from './lib/FeatureFlagReader.ts';
import FactoryLoader from './lib/FactoryLoader.ts';

/**
 * @summary Reads all feature flags to determine behavior of the server
 */
await FeatureFlagReader.readAll();

/**
 * @summary Instantiating instance of Application
 */
const app : Application = new Application();

/**
 * @summary Loading allowed HTTP origins
 */
Logger.debug('Loading all allowed HTTP origins...');
await HttpOriginReader.fetchOrigins(app);

/**
 * @summary Initializing router and its routes
 */
Logger.debug('Initializing router...');
app.use(Router.routes());
app.use(Router.allowedMethods());
await RouteLoader.loadRoutes();

/**
 * @summary Instantiates Database
 */
Logger.debug('Instantiating the database...');
const db = new Db({ debug: true });

/**
 * @summary Loads and links models that directly correlate to DB tables
 */
Logger.debug('Loading all DB models and linking them to the database...');
const models = await ModelLoader.loadDbModels();
db.link(models);

/**
 * @summary Loads and instantiates CRON jobs
 */
Logger.debug('Loading all CRON jobs...');
await CronLoader.loadCronJobs();

/**
 * @summary Load and run factories
 */
await FactoryLoader.loadAndRunFactories();

/**
 * @summary Instantiating listener
 */
const port : any = Config.getApiPort();

Logger.info(`Server successfully started and listening to port: ${port}`);

await app.listen({
    port: parseInt(port)
});
