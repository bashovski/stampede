class SettingsField {

    readonly name: string;
    readonly type: string;
    readonly pattern: RegExp | null;
    readonly minLength: number;
    readonly maxLength: number;

    constructor(
        name: string,
        type = 'text',
        pattern: RegExp | null = null,
        minLength = -1,
        maxLength = -1
    ) {
        this.name = name;
        this.type = type;
        this.pattern = pattern;
        this.minLength = minLength;
        this.maxLength = maxLength;
    }
}

export default SettingsField;
