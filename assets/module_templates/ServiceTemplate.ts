import Service, { ServiceResult } from './Service.ts';
import HttpResponse from '../http/HttpResponse.ts';

class __replace_me__Service extends Service {

    /**
     * @summary Index of all __replace_me__ REST resources
     * @param data
     * @returns object
     */
    static async index(data : any): Promise<ServiceResult> {
        return {
            response : new HttpResponse(200, {
                message: 'Hello friend!',
            })
        };
    }
}

export default __replace_me__Service;
