import HttpResponse from '../http/HttpResponse.ts';
import HttpError from '../http/HttpError.ts';

export interface ServiceResult {
    response?: HttpResponse,
    error?: HttpError,
    cookie?: any
}

class Service {

}

export default Service;
