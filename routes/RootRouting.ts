import Router from '../lib/Router.ts';
import HttpResponse from '../http/HttpResponse.ts';

Router.get('/', ({ response }) => {
    new HttpResponse(200, {
        message: 'Hello Friend!'
    }).send(response);
});
