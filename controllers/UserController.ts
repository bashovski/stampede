import Controller from './Controller.ts';
import UserService from '../services/UserService.ts';
import HttpResponse from "../http/HttpResponse.ts";
import Config from '../lib/Config.ts';
import Logger from '../lib/Logger.ts';

/**
 * @class UserController
 * @summary Handles all user-related HTTP requests
 */
class UserController extends Controller {

    /**
     * @summary Handles register request
     * @param ctx
     */
    public static async registerUser(ctx: any): Promise<void> {
        try {

            const { response, cookie, error } : any = await UserService.registerUser(await (ctx.request.body().value));

            if (cookie) ctx.cookies.set(cookie.getName(), cookie.getValue(), cookie.getOptions());

            (response || error).send(ctx.response);

        } catch(error) {
            Logger.error(error);
            super.sendDefaultError(ctx);
        }
    }

    /**
     * @summary Handles login request
     * @param ctx
     */
    public static async loginUser(ctx: any): Promise<void> {
        try {

            const { response, cookie, error } : any = await UserService.loginUser(await (ctx.request.body().value));

            if (cookie) ctx.cookies.set(cookie.getName(), cookie.getValue(), cookie.getOptions());

            (response || error).send(ctx.response);

        } catch(error) {
            Logger.error(error);
            super.sendDefaultError(ctx);
        }
    }

    /**
     * @summary Handles IAM request
     * @param ctx
     */
    public static async IAM(ctx: any): Promise<void> {
        try {

            const { response, error } : any = await UserService.IAM(ctx.cookies.get(Config.getSessionCookieName()));
            (response || error).send(ctx.response);

        } catch(error) {
            Logger.error(error);
            super.sendDefaultError(ctx);
        }
    }

    /**
     * @summary Handles logout request
     * @param ctx
     */
    public static async logoutUser(ctx: any): Promise<void> {
        try {

            const sessionCookie: string = Config.getSessionCookieName();
            const { response, error } : any = await UserService.logoutUser(ctx.cookies.get(sessionCookie));

            ctx.cookies.delete(sessionCookie);
            (response || error).send(ctx.response);

        } catch(error) {
            Logger.error(error);
            super.sendDefaultError(ctx);
        }
    }

    /**
     * @summary Handles account verification request
     * @param ctx
     */
    public static async verifyAccount(ctx: any): Promise<void> {
        try {
            const verificationIdentifier: string = ctx.params.id;
            const userId: string = await super.getUserId(ctx);
            const { response, error }: any = await UserService.verifyAccount(userId, verificationIdentifier);

            (response || error).send(ctx.response);
        } catch(error) {
            Logger.error(error.toString());
            super.sendDefaultError(ctx);
        }
    }

    /**
     * @summary Handles password resetting/updating
     * @param ctx
     */
    public static async resetUserPassword(ctx: any): Promise<void> {
        try {
            const payload = await (ctx.request.body().value) || {};
            const { response, error }: any = await UserService.resetUserPassword(payload);
            (response || error).send(ctx.response);
        } catch(error) {
            Logger.error(error.toString());
            super.sendDefaultError(ctx);
        }
    }

    /**
     * @summary Handles request for recovery code sending to user's email
     * @param ctx
     */
    public static async requireRecoveryCode(ctx: any): Promise<void> {
        try {
            const { email } = await (ctx.request.body().value) || { email: null };
            const { response, error }: any = await UserService.requireRecoveryCode(email);
            (response || error).send(ctx.response);
        } catch(error) {
            Logger.error(error.toString());
            super.sendDefaultError(ctx);
        }
    }

    /**
     * @summary Handles request for recovery code sending to user's email
     * @param ctx
     */
    public static async recover(ctx: any): Promise<void> {
        try {
            const body = await (ctx.request.body().value) || { email: null };
            const { response, error }: any = await UserService.recover(body);
            (response || error).send(ctx.response);
        } catch(error) {
            Logger.error(error.toString());
            super.sendDefaultError(ctx);
        }
    }
}

/**
 * @exports UserController
 */
export default UserController;
