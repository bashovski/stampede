import Loader from './Loader.ts';

class RouteLoader extends Loader {
    static async loadRoutes() {
        return await super.loadModules('./routes');
    }
}

export default RouteLoader;