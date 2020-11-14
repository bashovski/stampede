import { v4 } from "https://deno.land/std/uuid/mod.ts";

import Service, { ServiceResult } from './Service.ts';
import User, { PASSWORD_PATTERN } from '../models/User.ts';
import Cookie from '../lib/Cookie.ts';
import Logger from '../lib/Logger.ts';
import Session from '../models/Session.ts';
import HttpError from '../http/HttpError.ts';
import FeatureFlags from '../lib/FeatureFlags.ts';
import HttpResponse from '../http/HttpResponse.ts';
import Verification, { VERIFICATION_TOKEN_LENGTH } from '../models/Verification.ts';
import CredentialsEncryption from '../lib/CredentialsEncryption.ts';
import Validator, { ValidationRules } from '../lib/Validator.ts';
import Recovery from "../models/Recovery.ts";

export interface PasswordResetPayload {
    email: string,
    newPassword: string,
    oldPassword: string
}

class UserService extends Service {

    /**
     * @summary Registers a new user, does all required validations, checks, etc.
     * @param data
     * @returns object
     */
    public static async registerUser(data : any): Promise<ServiceResult> {

        const { invalidFields, message } : any = await User.isUserRegisterDataValid(data);
        if (invalidFields)
            return {
                error : new HttpError(400, {
                    invalidFields,
                    message: message ? message : 'Invalid input'
                })
            };

        const allowedFields : Array<string> = ['username', 'email', 'password', 'dateOfBirth'];
        data = Validator.sanitize(allowedFields, data);

        data.password = await CredentialsEncryption.encryptPassword(data.password);

        const user = await User.create({
            id: v4.generate(),
            isVerified: false,
            ...data
        } as any);

        const session : Session = await Session.generate(user.id);

        const cookie : Cookie = await session.getCookie();

        if (FeatureFlags.isFeatureEnabled('accountVerifications'))
            await Verification.generate(user.id);

        Logger.info(`User ${data.email} [@${data.username}] successfully registered.`, {
            email: data.email,
            username: data.username
        });

        return {
            cookie,
            response : new HttpResponse(201, {
                message: 'Successfully registered user',
            })
        };
    }

    /**
     * @summary Logs the user in. Persists a session.
     * @param data
     */
    public static async loginUser(data : any): Promise<ServiceResult> {

        const allowedFields : Array<string> = ['email', 'password'];
        data = Validator.sanitize(allowedFields, data);

        const [ user ] = await
            User
            .where({ email : data.email })
            .take(1)
            .get();

        if (!user)
            return {
                error: new HttpError(404, {
                    message: `There's no such account with passed credentials. Please sign up.`
                })
            };

        const isCorrect = await CredentialsEncryption.isPasswordCorrect(data.password, user.password);

        if (!isCorrect)
            return {
                error: new HttpError(401, {
                    message: 'Invalid password'
                })
            };

        const session : Session = await Session.generate(user.id);

        const cookie : Cookie = await session.getCookie();

        Logger.info(`User ${data.email} [@${user.username}] successfully logged in.`, {
            email: data.email,
            username: user.username
        });

        return {
            cookie,
            response : new HttpResponse(200, {
                message: 'Successfully logged in'
            })
        };
    }

    /**
     * @summary Retrieves user data to the user.
     * @param token
     */
    public static async IAM(token: string): Promise<ServiceResult> {

        const [ session ]: [ Session|any ] = await Session.select('user_id').where({ token }).take(1).get();
        let [ user ]: [ User|any ] = await User.selectExcept('password', 'email').where({ id: session.userId }).take(1).get();

        user = User.redefineResultProperties(user, 'password', 'email');

        return {
            response: new HttpResponse(200, {
                user
            })
        };
    }

    /**
     * @summary Logs out the user by removing user's session.
     * @param token
     */
    public static async logoutUser(token: string): Promise<ServiceResult> {

        await Session.where({ token }).delete();
        return {
            response: new HttpResponse(204, {})
        }
    }

    /**
     * @summary Verifies user's account
     * @param userId
     * @param verificationToken
     */
    public static async verifyAccount(userId: string|null, verificationToken: string): Promise<ServiceResult> {

        const [ user ]: [ User|any ] = await User.where({
            id: userId
        }).take(1).get();

        if (user.isVerified) return {
            response: new HttpError(400, {
                message: 'Your account is already verified.'
            })
        };

        if (verificationToken.length !== VERIFICATION_TOKEN_LENGTH) {
            return {
                response: new HttpError(400, {
                    message: `Verification token length must be ${VERIFICATION_TOKEN_LENGTH} characters.`
                })
            };
        }

        const [ verification ]: [ Verification|any ] = await Verification.where({
            user_id: userId,
            token: verificationToken
        }).take(1).get();

        if (!verification) {
            return {
                response: new HttpError(404, {
                    message: 'You have inserted incorrect verification token.'
                })
            };
        }

        await User.where({
            id: userId
        }).update({
            'is_verified': true
        });

        await Verification.deleteById(verification.id);

        return {
            response: new HttpResponse(200, {
                message: 'Account successfully verified!'
            })
        };
    }

    /**
     * @summary Resets/updates user's password
     * @param payload
     */
    public static async resetUserPassword(payload: PasswordResetPayload): Promise<ServiceResult> {

        const rules: ValidationRules = {
            email: {
                required: true,
                email: true
            },
            oldPassword: {
                required: true
            },
            newPassword: {
                required: true,
                regExp: PASSWORD_PATTERN
            }
        };

        const { invalidFields } = await Validator.validate(rules, payload);
        if (invalidFields.length) {
            return {
                error: new HttpError(400, {
                    invalidFields
                })
            };
        }

        const [ user ]: [ User|any ] = await
            User
                .where({ email : payload.email })
                .take(1)
                .get();

        if (!user)
            return {
                error: new HttpError(404, {
                    message: `There's no account registered with this email.`
                })
            };

        if (payload.oldPassword === payload.newPassword)
            return {
                error: new HttpError(400, {
                    message: 'Your new password must be different compared to your old one.'
                })
            };

        const isCorrect = await CredentialsEncryption.isPasswordCorrect(payload.oldPassword, user.password);

        if (!isCorrect)
            return {
                error: new HttpError(401, {
                    message: 'Invalid password'
                })
            };

        await User.where({
            id: user.id
        }).update({
            password: await CredentialsEncryption.encryptPassword(payload.newPassword)
        });

        await Session.where({
            'user_id': user.id
        }).delete();

        return {
            response: new HttpResponse(200, {
                message: 'Password successfully reset.'
            })
        };
    }

    public static async requireRecoveryCode(email: string): Promise<ServiceResult> {

        const rules: ValidationRules = {
            email: {
                required: true,
                email: true
            }
        };

        const { invalidFields } = await Validator.validate(rules, { email });
        if (invalidFields.length) {
            return {
                error: new HttpError(400, {
                    invalidFields
                })
            };
        }

        const [ user ] = await
            User
            .where({ email })
            .take(1)
            .get();


        if (!user)
            return {
                error: new HttpError(404, {
                    message: `There's no account registered with this email.`
                })
            };

        await Recovery.generate(user.id);

        return {
            response : new HttpResponse(200, {
                message: 'Recovery code successfully sent.'
            })
        };
    }

    public static async recover(payload: any): Promise<ServiceResult> {

        const rules: ValidationRules = {
            recoveryCode: {
                required: true,
                minLength: 12,
                maxLength: 12
            },
            password: {
                required: true,
                regExp: PASSWORD_PATTERN
            }
        };

        const { invalidFields } = await Validator.validate(rules, payload);
        if (invalidFields.length) {
            return {
                error: new HttpError(400, {
                    invalidFields
                })
            };
        }

        const [ recovery ]: any = await Recovery.where({
            token: payload.recoveryCode
        }).take(1).get();

        if (!recovery)
            return {
                error: new HttpError(404, {
                    message: `You have entered an invalid code.`
                })
            };

        const [ user ]: any = await User.where({
            id: recovery.userId
        }).take(1).get();

        if (!user)
            return {
                error: new HttpError(404, {
                    message: `You have entered an invalid code. (#2)`
                })
            };

        await User.where({
            id: user.id
        }).update({
            password: await CredentialsEncryption.encryptPassword(payload.password)
        });

        await Session.where({
            'user_id': user.id
        }).delete();

        await Recovery.where({
            'user_id': user.id
        }).delete();

        return {
            response : new HttpResponse(200, {
                message: 'Successfully recovered account.'
            })
        };
    }
}

export default UserService;
