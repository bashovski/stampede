import { getStatusCodeDescription } from './descriptions.ts';

/**
 * @summary Represents a class whose main goal is to programmatically represent the response sent back to a client
 * @class HttpResponse
 */
class HttpResponse {

    statusCode : number;
    body : Object|null;
    headers : Array<any>|null;
    type : string|null;

    constructor(
        statusCode : number,
        body : Object|null = null,
        headers : Array<any> | null = null,
        type : string | null = null
    ) {
        this.statusCode = statusCode;
        this.body = body || this.getDefaultResponseBody();
        this.headers = headers;
        this.type = type;
    }

    /**
     * @summary Sends the response to a client
     * @param response
     */
    public send(response : any): void {
        response.status = this.statusCode;
        response.body = this.body;

        if (this.headers)
            response.headers = this.headers;

        if (this.type)
            response.type = this.type;
    }

    private getDefaultResponseBody(): object {
        return {
            message: getStatusCodeDescription(this.statusCode)
        };
    }
}

export default HttpResponse;
