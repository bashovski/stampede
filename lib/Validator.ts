import { DataTypes } from 'https://raw.githubusercontent.com/Otomatto/denodb/master/mod.ts';
import { v4 } from "https://deno.land/std/uuid/mod.ts";

/**
 * @summary Interface of all allowed validation opts.
 * @interface
 */
export interface ValidationOpts {
    minLength?: number,
    maxLength?: number,
    regExp?: RegExp | string, // Term 'regExp', instead of 'regEx' has been in JS world for quite a while, hence it's being used here as well
    unique?: any, // Originally accepts a Model, if false, won't perform any checking (can be omitted as well)
    required?: boolean, // Allows nullable values, but not the undefined ones
    email?: boolean,
    uuid?: boolean,
    includes?: any, // Please note that this is case sensitive. Transform the field value and all array elements to lowercase and then compare them if needed.
    excludes?: any,
    notIn?: Array<any>,
    in?: Array<any>,
    equals?: any,
    between?: Array<number>,
    gt?: number,
    gte?: number,
    lt?: number,
    lte?: number
}

/**
 * @summary Interface for validation results (return values of each validator method)
 * @interface
 */
export interface ValidationResult {
    success: boolean,
    invalidFields: Array<any>
}

/**
 * @summary Interface for validation rules (An object containing props whose values correlate to ValidationOpts).
 * @interface
 */
export interface ValidationRules {
    [field: string]: ValidationOpts
}

export interface InvalidField {
    name: string,
    passedValue: any,
    error: string
}

class Validator {

    public static async isModelDataValid(model : any, data : any) : Promise<any> {
        const modelFields = model.fields;
        for (const field in modelFields) {
            if (!Object.prototype.hasOwnProperty.call(data, field) && (!modelFields[field].allowNull && typeof modelFields[field].allowNull === 'boolean'))
                return { success: false, validationFailedAt: field };
            this.validateField(modelFields, field, data);
        }
        return { success: true };
    }

    private static validateField(modelFields : any, field : any, value : any) {

        const fieldType = modelFields[field];

        /**
         * @summary Trivial validation, as an example
         */
        if (fieldType === DataTypes.INTEGER) {
            const boundary = Math.pow(2, 31);
            return value <= boundary && value >= -boundary;
        }

        /**
         * @summary Any passed UUID ought to be UUIDv4
         */
        if (fieldType === DataTypes.UUID)
            return value.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    }

    public static sanitize(allowedFields : Array<string>, data : any) {
        for (let field in data) {
            if (Object.prototype.hasOwnProperty.call(data, field) && !allowedFields.includes(field))
                delete data[field];
        }
        return data;
    }

    public static validateModel(model: any, fields: any): ValidationResult {
        return {
            success: true,
            invalidFields: []
        };
    }

    /**
     * @summary Consumes the assigned rules and fields for validations to iteratively validate passed payload.
     * @param rules
     * @param fields
     */
    public static async validate(rules: ValidationRules, fields: object = {}): Promise<ValidationResult> {
        const invalidFields: Array<string> = [];

        for (const field in rules) {

            if (!Object.prototype.hasOwnProperty.call(rules, field)) continue;

            for (const rule in rules[field]) {

                if (!Object.prototype.hasOwnProperty.call(rules[field], rule)) continue;
                const func = `validate${rule.charAt(0).toUpperCase() + rule.slice(1)}`;

                // @ts-ignore
                if (this[func]) {

                    // @ts-ignore
                    const validationError = await (this[func] as any)(field, fields[field], rules[field][rule]);

                    if (validationError) {
                        invalidFields.push(validationError);
                        break;
                    }
                }
            }
        }

        return {
            success: invalidFields.length === 0,
            invalidFields
        };
    }

    /**
     * @summary Checks whether field string lengths is below minimum characters required rule.
     * @param fieldName
     * @param fieldValue
     * @param minLength
     */
    private static validateMinLength(fieldName: string, fieldValue: string, minLength: number): InvalidField | undefined {
        return String(fieldValue).length < minLength
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName} should be at least ${minLength} characters long.`
            } : undefined;
    }

    /**
     * @summary Checks if field string length exceeds declared rule length.
     * @param fieldName
     * @param fieldValue
     * @param maxLength
     */
    private static validateMaxLength(fieldName: string, fieldValue: string, maxLength: number): InvalidField | undefined {
        return String(fieldValue).length > maxLength
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName} should not exceed ${maxLength} characters limit.`
            } : undefined;
    }

    /**
     * @summary Checks if there's an already existing REST resource with specified field value bonded to field name.
     *          It uses a model as a reference to search for another occurrence.
     *          Other instances, objects or types won't work. Validation will function normally if and only if the
     *          passed model is inheriting Model class from '/lib/Model.ts' which inherits DenoDB's Model.
     * @param fieldName
     * @param fieldValue
     * @param model
     */
    private static async validateUnique(fieldName: string, fieldValue: string, model: any): Promise<InvalidField | undefined> {
        if (!model) return undefined;

        const isDuplicate = await this.isDuplicate(model, fieldName, fieldValue);
        return isDuplicate ? {
            name: fieldName,
            passedValue: fieldValue,
            error: `A record with this ${fieldName} already exists.`
        } : undefined;
    }

    /**
     * @summary Executes the query and returns a boolean indicating whether there's an occurrence or not.
     * @param model
     * @param field
     * @param value
     */
    private static async isDuplicate(model: any, field: string, value: any): Promise<boolean> {
        const duplicate = await model.where({
            [field] : value
        }).take(1).get();

        return !!duplicate.length;
    }

    /**
     * @summary Checks if passed string matches the regular expression pattern
     * @param fieldName
     * @param fieldValue
     * @param regExp
     */
    private static validateRegExp(fieldName: string, fieldValue: string, regExp: RegExp | string): InvalidField | undefined {
        return fieldValue && !fieldValue.toString().match(regExp)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName}'s format is invalid.`
            } : undefined;
    }

    /**
     * @summary Checks if required field is present.
     * @param fieldName
     * @param fieldValue
     */
    private static validateRequired(fieldName: string, fieldValue: boolean): InvalidField | undefined {
        return fieldValue === undefined || !fieldValue.toString().length
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName} is required.`
            } : undefined;
    }

    /**
     * @summary Checks if passed field value matches email regular expression
     * @param fieldName
     * @param fieldValue
     */
    private static validateEmail(fieldName: string, fieldValue: string): InvalidField | undefined {
        return fieldValue && !fieldValue.toString().match(/^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName} doesn't have an email format.`
            } : undefined;
    }

    /**
     * @summary Validates field with expected UUID value.
     * @param fieldName
     * @param fieldValue
     */
    private static validateUuid(fieldName: string, fieldValue: string): InvalidField | undefined {
        return !v4.validate(fieldValue)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName} must be an UUID.`
            } : undefined;
    }

    /**
     * @summary Checks if passed array includes predefined value.
     * @param fieldName
     * @param fieldValue
     * @param toBeIncluded
     */
    private static validateIncludes(fieldName: string, fieldValue: any, toBeIncluded: any): InvalidField | undefined {
        return fieldValue && !fieldValue.includes(toBeIncluded)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName} should include ${toBeIncluded}.`
            } : undefined;
    }

    /**
     * @summary Checks if passed array excludes predefined value.
     * @param fieldName
     * @param fieldValue
     * @param toBeExcluded
     */
    private static validateExcludes(fieldName: string, fieldValue: any, toBeExcluded: any): InvalidField | undefined {
        return fieldValue && fieldValue.includes(toBeExcluded)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName} should exclude ${toBeExcluded}.`
            } : undefined;
    }

    /**
     * @summary Validates if a passed value isn't part of a predefined array
     * @param fieldName
     * @param fieldValue
     * @param array
     */
    private static validateNotIn(fieldName: string, fieldValue: any, array: Array<any>): InvalidField | undefined {
        return array && array.includes(fieldValue)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldValue} is part of ${fieldName}.`
            } : undefined;
    }

    /**
     * @summary Validates if a passed value isn part of a predefined array
     * @param fieldName
     * @param fieldValue
     * @param array
     */
    private static validateIn(fieldName: string, fieldValue: any, array: Array<any>): InvalidField | undefined {
        return array && !array.includes(fieldValue)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldValue} is not part of ${fieldName}.`
            } : undefined;
    }

    /**
     * @summary Validates values equality
     * @param fieldName
     * @param fieldValue
     * @param equalWith
     */
    private static validateEquals(fieldName: string, fieldValue: any, equalWith: any): InvalidField | undefined {
        return fieldValue !== equalWith
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName}'s ${fieldValue} is not equal with expected ${equalWith}.`
            } : undefined;
    }

    /**
     * @summary Checks if field value is in range. There should be two numbers in an array. It refers to the first and the last one.
     * @param fieldName
     * @param fieldValue
     * @param range
     */
    private static validateBetween(fieldName: string, fieldValue: any, range: Array<number>): InvalidField | undefined {
        return fieldValue < range[0] || fieldValue > range[range.length - 1]
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName}'s value (${fieldValue}) is not in desired range.`
            } : undefined;
    }

    /**
     * @summary Checks if the passed value is greater than the predefined one
     * @param fieldName
     * @param fieldValue
     * @param comparedTo
     */
    private static validateGt(fieldName: string, fieldValue: any, comparedTo: number): InvalidField | undefined {
        return !(fieldValue > comparedTo)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName}'s value (${fieldValue}) is not greater than ${comparedTo}.`
            } : undefined;
    }

    /**
     * @summary Checks if the passed value is greater than or equal to the predefined one
     * @param fieldName
     * @param fieldValue
     * @param comparedTo
     */
    private static validateGte(fieldName: string, fieldValue: any, comparedTo: number): InvalidField | undefined {
        return !(fieldValue >= comparedTo)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName}'s value (${fieldValue}) is not greater than or equal to ${comparedTo}.`
            } : undefined;
    }

    /**
     * @summary Checks if the passed value is less than the predefined one
     * @param fieldName
     * @param fieldValue
     * @param comparedTo
     */
    private static validateLt(fieldName: string, fieldValue: any, comparedTo: number): InvalidField | undefined {
        return !(fieldValue < comparedTo)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName}'s value (${fieldValue}) is not less than ${comparedTo}.`
            } : undefined;
    }

    /**
     * @summary Checks if the passed value is less than or equal to the predefined one
     * @param fieldName
     * @param fieldValue
     * @param comparedTo
     */
    private static validateLte(fieldName: string, fieldValue: any, comparedTo: number): InvalidField | undefined {
        return !(fieldValue <= comparedTo)
            ? {
                name: fieldName,
                passedValue: fieldValue,
                error: `${fieldName}'s value (${fieldValue}) is not less than or equal to ${comparedTo}.`
            } : undefined;
    }
}

export default Validator;
