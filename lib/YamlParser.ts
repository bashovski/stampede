import { parse } from 'https://deno.land/std/encoding/yaml.ts';

class YamlParser {

    private readonly data: string;
    private parsedContent: any;

    constructor(data : string) {
        this.data = data;
        this.parseData();
    }

    private parseData() {
        this.parsedContent = parse(this.data);
    }

    public getData(): string {
        return this.data;
    }

    public getParsedContent(): any {
        return this.parsedContent;
    }
}

export default YamlParser;
