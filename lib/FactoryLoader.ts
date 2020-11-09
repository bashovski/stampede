import Loader from "./Loader.ts";
import FeatureFlags from "./FeatureFlags.ts";
import Logger from "./Logger.ts";

class FactoryLoader {
    public static async loadAndRunFactories() {

        if (!FeatureFlags.isFeatureEnabled('runFactoriesOnBoot')) return;

        Logger.debug('Loading and running factories...');
        const factories = await Loader.loadModules('./db/factories');
        for (const factory of factories) {
            new factory.default().populate();
        }
    }
}

export default FactoryLoader;
