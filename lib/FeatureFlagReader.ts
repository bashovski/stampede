import YamlParser from '../lib/YamlParser.ts';
import FeatureFlags from './FeatureFlags.ts';

/**
 * @class FeatureFlagReader
 */
class FeatureFlagReader {
    /**
     * @summary Reads and proceeds to set all feature flags
     * @returns {Promise<void>}
     */
    public static async readAll(): Promise<void> {
        const decoder = new TextDecoder('utf-8');
        const rawData = await Deno.readFile('feature_flags.yaml');
        const parser : YamlParser = new YamlParser(decoder.decode(rawData));

        const { featureFlags } = parser.getParsedContent() || [];

        if (!featureFlags || !Object.keys(featureFlags).length)
            throw 'There aren\'t any feature flags. Please assure that all of them are present in the file.';

        FeatureFlags.setFeatureFlags(featureFlags);
    }
}

export default FeatureFlagReader;
