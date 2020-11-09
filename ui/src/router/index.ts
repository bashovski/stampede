import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
// @ts-ignore
import Auth from '../auth';

Vue.use(VueRouter);

/**
 * @summary Enumeration for route guards
 * @enum
 */
export enum Guard {
    RequiresAuth, // Authentication required for this route
    NoAuth, // User mustn't be authenticated whilst navigating to this route
    Universal // Not required in case there's no guard for a route
}

export const routes: Array<RouteConfig | any> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        guardType: Guard.NoAuth
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        guardType: Guard.NoAuth
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/AccountSettings.vue'),
        guardType: Guard.RequiresAuth
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('@/views/Logout.vue'),
        guardType: Guard.RequiresAuth
    },
    {
        path: '/resetpassword',
        name: 'ResetPassword',
        component: () => import('@/views/ResetPassword.vue'),
        guardType: Guard.RequiresAuth
    },
    {
        path: '/recover',
        name: 'RecoverAccount',
        component: () => import('@/views/RecoverAccount.vue'),
        guardType: Guard.NoAuth
    },
    {
        path: '/verify',
        name: 'Verify Email',
        component: () => import('@/views/VerifyEmail.vue'),
        guardType: Guard.RequiresAuth
    }
];

const getRouteByName = (name: string): RouteConfig | any => {
    return routes.find((route: RouteConfig | any): boolean => route.name === name);
};

/**
 * @summary Guards a route depending on user's auth status
 */
const beforeEnter = async (to: any, from: any, next: () => void) => {
    /**
     * @todo Optimize and reduce amount of sent IAM (~20ms) requests.
     * Initially I wanted to rely on cache and on the initially sent IAM request.
     * Unfortunately, I'd have to risk bunch of memory usage and plug a event listener by implementing an event-bus
     * or something similar which I ought to avoid at this stage of project. The request we are sending is taking 20ms
     * most of the time and is the safest option right now. Better safe than sorry.
     */
    const isLoggedIn = await Auth.authenticate();

    if (!to.name)
        return next();

    const route = getRouteByName(to && to.name);

    if ((isLoggedIn && route.guardType === Guard.NoAuth) || (!isLoggedIn && route.guardType === Guard.RequiresAuth))
        return router.push({name: 'Home'});

    next();
};

/**
 * @summary Maps route guards for all routes which have sufficient route guard assigned to them
 * @returns rval<RouteConfig | any>
 */
const mapRouteGuards = () => {
    const rval: Array<RouteConfig | any> = routes.map((route): RouteConfig | any => {
        if (route.guardType !== undefined) {
            route.beforeEnter = beforeEnter;
        }
        return route;
    });
    return rval;
}

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    linkExactActiveClass: 'active',
    routes: mapRouteGuards()
});

export default router;
