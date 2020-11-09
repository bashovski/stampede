import Config from '../lib/Config.ts';
import Session from '../models/Session.ts';
import HttpResponse from "../http/HttpResponse.ts";

/**
 * @class Controller
 */
class Controller {
    /**
     * @summary Consumes passed user session cookie to retrieve the session's holder.
     * @param ctx
     * @returns {Promise<string>}
     */
    public static async getUserId(ctx: any): Promise<string> {
        const sessionCookie: string = Config.getSessionCookieName();
        const [ session ]: [ Session|any ] = await Session.select('user_id').where({
            token: ctx.cookies.get(sessionCookie)
        }).take(1).get();
        return session.userId;
    }

    /**
     * @summary Sends default (400 - Bad request) HTTP error to the client
     * @param ctx
     */
    public static sendDefaultError(ctx: any): void {
        new HttpResponse(400, {
            error: 'Bad request'
        }).send(ctx.response);
    }
}

export default Controller;
