import Session from '../models/Session.ts';
import HttpError from '../http/HttpError.ts';
import Config from '../lib/Config.ts';

/**
 * @class AuthMiddleware
 */
class AuthMiddleware {

    /**
     * @summary Authenticates user by consuming user's session token
     * @param ctx
     * @param next
     */
    static async authenticateUser(ctx : any, next: any) {

        const token = ctx.cookies.get(Config.getSessionCookieName());
        const session = token ? await Session.where('token', token).count() : 0;

        if (!Number(session))
            return new HttpError(401, {
                message: 'Unauthorized',
            }).send(ctx.response);

        await next();
    }
}

export default AuthMiddleware;
