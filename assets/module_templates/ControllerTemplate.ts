import Controller from './Controller.ts';
import __replace_me__Service from '../services/__replace_me__Service.ts';
import Logger from '../lib/Logger.ts';

/**
 * @class __replace_me__Controller
 * @summary Handles all __replace_me__-related HTTP requests
 */
class __replace_me__Controller extends Controller {

    /**
     * @summary Handles index request
     * @param ctx
     */
    static async index(ctx: any): Promise<void> {
        try {

            const { response, error } : any = await __replace_me__Service.index();
            (response || error).send(ctx.response);

        } catch(error) {
            Logger.error(error);
            super.sendDefaultError(ctx);
        }
    }
}

/**
 * @exports __replace_me__
 */
export default __replace_me__Controller;
