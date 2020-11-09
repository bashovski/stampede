import SettingsField from './SettingsField';

class Setting {

    readonly name: string;
    readonly fields: Array<SettingsField>;

    constructor(
        name: string,
        fields: Array<SettingsField>
    ) {
        this.name = name;
        this.fields = fields;
    }
}

export default Setting;
