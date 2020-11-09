import Router from '../lib/Router.ts';
import HttpResponse from '../http/HttpResponse.ts';

Router.get('/__replace_plural_model_name__', (ctx: any) => {
    new HttpResponse(200, {
        message: 'Request to /__replace_plural_model_name__ endpoint functions normally.'
    }).send(ctx.response);
});
