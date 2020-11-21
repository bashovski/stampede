import { walk } from '../deps.ts';

class Loader {
    static async loadModules(directory: string) {
        let modules : Array<any> = [];
        for await(const entry of await walk(directory)) {
            if (entry.isFile)
                modules.push(await import(`../${entry.path}`));
        }
        return modules;
    }
}

export default Loader;
