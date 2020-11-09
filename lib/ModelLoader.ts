import Loader from './Loader.ts';

class ModelLoader extends Loader {
    /**
     * @summary Loads all modules of Db models
     * @returns {Array<Model>}
     */
    static async loadDbModels() {
        const models = await super.loadModules('./models');
        return models.map(model => model.default);
    }
}

export default ModelLoader;
