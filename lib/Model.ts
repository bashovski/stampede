import { Model as DbModel } from 'https://raw.githubusercontent.com/eveningkid/denodb/abed3063dd92436ceb4f124227daee5ee6604b2d/mod.ts';

class Model extends DbModel {
    static selectExcept(...fields: Array<string>) {
        const modelFields = Object.keys(this.fields).map(key => this.camelToSnakeCase(key));
        return super.select(modelFields.filter((field: any) => !fields.includes(field)) as any);
    }

    static camelToSnakeCase(str: string) {
        return str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);
    }

    static redefineResultProperties(modelInstance: any, ...props : Array<string>) {
        const modelFields = Object.keys(this.fields).filter((field: string) => !props.includes(field) as boolean);
        const result: any = {};
        for (const i in modelFields) {
            result[modelFields[i]] = modelInstance[i];
        }
        return result;
    }

    private static convertKeysToSQLFields(payload: any): any {
        for (const key in payload) {

            if (!Object.prototype.hasOwnProperty.call(payload, key)) continue;

            const converted = this.camelToSnakeCase(key);
            if (converted === key) continue;

            payload[converted] = payload[key];
            delete payload[key];
        }
        return payload;
    }

    public static async create(payload: any): Promise<any> {
        return super.create(this.convertKeysToSQLFields(payload));
    }
}

export default Model;
