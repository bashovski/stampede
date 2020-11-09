import http from '@/http';
import { Guard, routes } from "@/router";

export const setInterceptors = () => {

    http
    .interceptors
    .response
    .use(res => res, async err => {
        const { guardType } = findRouteByPath(window.location.path);
        if(err.response.status === 401 && guardType && guardType === Guard.RequiresAuth) {
            window.location = '/';
        }

        await Promise.reject(err);
    });
};

const findRouteByPath = path => {
    for (const route in routes) {
        if (!Object.prototype.hasOwnProperty.call(routes, route)) continue;
        if (routes[route].path === path) return routes[route];
    }
    return { guardType: null };
};

export default {
    setInterceptors
};
