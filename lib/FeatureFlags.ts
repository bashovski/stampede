/**
 * @class FeatureFlags
 */
class FeatureFlags {

    private static flags?: any;

    public static setFeatureFlags(flags: any): void {
        this.flags = flags;
    }

    public static setFeatureFlag(flag: string, value: any): void {
        this.flags[flag] = value;
    }

    /**
     * @summary Checks if the feature flag is present and if it's enabled
     * @param flag
     */
    public static isFeatureEnabled(flag: string): boolean {
        return (Object.prototype.hasOwnProperty.call(this.flags || {}, flag)) && (this.flags || {})[flag] !== undefined
            ? Boolean(this.flags[flag])
            : false;
    }
}

export default FeatureFlags;
