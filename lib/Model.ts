import { Model as DbModel } from 'https://raw.githubusercontent.com/Otomatto/denodb/master/mod.ts';

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
}

export default Model;
