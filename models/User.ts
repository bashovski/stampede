import moment from 'https://cdn.skypack.dev/moment';
import { DataTypes } from 'https://raw.githubusercontent.com/Otomatto/denodb/master/mod.ts';
import Config from '../lib/Config.ts';
import Model from '../lib/Model.ts';
import Validator, { ValidationRules } from '../lib/Validator.ts';

export const USERNAME_PATTERN = /^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$/;
export const PASSWORD_PATTERN = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{7,50}$/;

class User extends Model {
    static table = 'users';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            length: 128
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            length: 64
        },
        password: {
            type: DataTypes.STRING,
            length: 256,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            length: 128,
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATETIME,
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }

    public static async isUserRegisterDataValid(body : any) : Promise<object> {

        const rules: ValidationRules = {
            username: {
                required: true,
                minLength: 3,
                maxLength: 32,
                regExp: USERNAME_PATTERN,
                unique: User
            },
            email: {
                required: true,
                email: true,
                unique: User
            },
            password: {
                required: true,
                regExp: PASSWORD_PATTERN
            },
            dateOfBirth: {
                required: true
            }
        };

        const { success, invalidFields } = await Validator.validate(rules, body);

        if (!success || invalidFields.length)
            return {
                invalidFields
            };

        const dateOfBirth = new Date(body.dateOfBirth);
        if (isNaN(dateOfBirth as any) || moment().diff(dateOfBirth, 'years') < Config.getMinUserAge())
            return {
                invalidFields: [
                    {
                        name: 'dateOfBirth',
                        error: `In order to sign up, you must be at least ${Config.getMinUserAge()} years old.`
                    }
                ]
            };
        return {};
    }
}

export default User;
