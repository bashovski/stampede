import { walk } from 'https://deno.land/std/fs/mod.ts';

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
