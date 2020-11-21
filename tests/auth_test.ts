/**
 * @summary Unit tests for all user service-related methods
 * @test
 */

import { assertEquals } from 'https://deno.land/std@0.70.0/testing/asserts.ts';
import Config from '../lib/Config.ts';
import UserService from '../services/UserService.ts';
import BootstrapDb from './bootstrapper/db_bootstrapper.ts';
import BootstrapFeatureFlags from './bootstrapper/feature_flags_bootstrapper.ts';
import FeatureFlags from '../lib/FeatureFlags.ts';
import Verification, { VERIFICATION_TOKEN_LENGTH } from '../models/Verification.ts';

const userData = {
    username: 'testAccount',
    email: 'test@test_example.org',
    password: 'TestPassword9999',
    dateOfBirth: new Date('01-01-1990')
};

let userCookie: any;
let userId: string;

Deno.test({
    name: 'Register new user',
    fn: async () => {
        const db = await BootstrapDb();

        await BootstrapFeatureFlags();

        const tempPw = userData.password;
        const { response, cookie, error }: any = await UserService.registerUser(userData);
        userData.password = tempPw;

        assertEquals(response.statusCode, 201);
        assertEquals(cookie.name, Config.getSessionCookieName());
        assertEquals(error, undefined);

        await db.close();
    },
    sanitizeOps: false, //  There are a couple of asynchronous transport operations that are running in background
    sanitizeResources: false
});

Deno.test({
    name: 'Log in as a recently registered user',
    fn: async () => {
        const db = await BootstrapDb();

        await BootstrapFeatureFlags();

        const { response, cookie, error }: any = await UserService.loginUser({
            email: userData.email,
            password: userData.password
        });

        userCookie = cookie;

        assertEquals(response.statusCode, 200);
        assertEquals(cookie.getName(), Config.getSessionCookieName())
        assertEquals(cookie.getValue().length > 0, true);
        assertEquals(error, undefined);

        await db.close();
    },
    sanitizeOps: false, //  There are a couple of asynchronous transport operations that are running in background
    sanitizeResources: false
});

Deno.test({
    name: 'IAM',
    fn: async () => {
        const db = await BootstrapDb();

        await BootstrapFeatureFlags();

        const { response, error }: any = await UserService.IAM(userCookie.getValue());
        const { user } = response.body;

        userId = user.id;

        assertEquals(response.statusCode, 200);
        assertEquals(error, undefined);
        assertEquals(user.username, userData.username);

        await db.close();
    },
    sanitizeOps: false, //  There are a couple of asynchronous transport operations that are running in background
    sanitizeResources: false
});

Deno.test({
    name: 'Verify account',
    fn: async () => {
        const db = await BootstrapDb();

        await BootstrapFeatureFlags();

        if (!FeatureFlags.isFeatureEnabled('accountVerifications'))
            return console.log('Skipping test for account verifications since the feature has been disabled.');

        const [ { token } ] = await Verification.where({
            'user_id': userId
        }).take(1).get();

        const { response, error }: any = await UserService.verifyAccount(userId, token);

        assertEquals(response.statusCode, 200);
        assertEquals(error, undefined);
        assertEquals(token.length, VERIFICATION_TOKEN_LENGTH);

        await db.close();
    },
    sanitizeOps: false, //  There are a couple of asynchronous transport operations that are running in background
    sanitizeResources: false
});
