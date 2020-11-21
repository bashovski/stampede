import { Application } from '../deps.ts';
import { oakCors } from "../deps.ts";
import YamlParser from "../lib/YamlParser.ts";

/**
 * @summary Provides reading of allowed specified origins
 * @class HttpOriginReader
 */
class HttpOriginReader {

    /**
     * @summary Fetches allowed origins used to receive HTTP requests
     * @param app
     * @returns Promise<Array<string>>
     */
    public static async fetchOrigins(app: Application): Promise<Array<string>> {
        const decoder = new TextDecoder('utf-8');
        const rawData = await Deno.readFile('http/origins.yaml');
        const parser : YamlParser = new YamlParser(decoder.decode(rawData));

        const { allowed } = parser.getParsedContent() || [];

        if (!allowed || !allowed.length)
            console.log('[warning] You haven\'t specified any allowed origin.');

        app.use(
            oakCors({
                origin: allowed,
                allowedHeaders: ['Cookie', 'Authorization', 'Content-Type', 'Accept'],
                credentials: true,
                optionsSuccessStatus: 200
            })
        );

        return allowed;
    }
}


export default HttpOriginReader;
