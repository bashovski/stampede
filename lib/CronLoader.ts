import Loader from './Loader.ts';

class ModelLoader extends Loader {
    /**
     * @summary Loads all Cron jobs and instantiates them.
     * @returns {Promise<void>}
     */
    static async loadCronJobs(): Promise<void> {
        const jobs = await super.loadModules('./cron');
        jobs.map(job => job.default.schedule());
    }
}

export default ModelLoader;
