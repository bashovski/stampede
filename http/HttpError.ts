import HttpResponse from './HttpResponse.ts';

/**
 * @summary HttpError represents a class which primarily acts as a blueprint for instances of HTTP errors that are being sent back to client
 * @extends HttpResponse
 * @class HttpError
 */
class HttpError extends HttpResponse {
    constructor(
        statusCode : Number,
        body : Object,
        headers : Array<any> | null = null,
        type : string | null = null
    ) {

        if (statusCode < 400 || statusCode > 600)
            throw 'unable to instantiate HttpError - error status code invalid';

        super(statusCode, body, headers, type);
    }
}

export default HttpError;
