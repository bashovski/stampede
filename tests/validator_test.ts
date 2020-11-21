/**
 * @summary Unit tests for the Validator module
 * @test
 */

import { assertEquals } from '../deps.ts';
import Validator, { ValidationRules } from '../lib/Validator.ts';
import User from '../models/User.ts';
import BootstrapDb from './bootstrapper/db_bootstrapper.ts';
import { v4 } from '../deps.ts';

Deno.test({
    name: 'Validator - expected, correct values (No DB)',
    fn: async () => {

        const rules: ValidationRules = {
            id: {
                required: true,
                uuid: true
            },
            username: {
                required: true,
                regExp: /^[a-zA-Z0-9]+(?:[_ -]?[a-zA-Z0-9])*$/
            },
            email: {
                required: true,
                email: true
            },
            currentWatch: {
                in: ['Seamaster', 'Nautilus', 'Yachtmaster', 'Radiomir', 'Monaco', 'Santos Dumont']
            },
            secretNumber: {
                between: [200, 400]
            }
        };

        const body = {
            id: v4.generate(),
            username: 'test_username',
            email: 'test@example.com',
            currentWatch: 'Seamaster',
            secretNumber: 250
        };

        const { success, invalidFields } = await Validator.validate(rules, body);

        assertEquals(success, true);
        assertEquals(invalidFields.length === 0, true);
    },
});

Deno.test({
    name: 'Validator - REST resource uniqueness check',
    fn: async () => {

        const db = await BootstrapDb();

        const rules: ValidationRules = {
            id: {
                required: true,
                unique: User
            }
        };

        const body = {
            id: v4.generate(),
            username: 'testAccount',
            email: 'test@example.org',
            password: 'TestPassword9999',
            dateOfBirth: new Date(),
            isVerified: false
        };

        // Remove created user from previous test if it failed
        await User.where({ username: body.username }).delete();

        let { success, invalidFields } = await Validator.validate(rules, body);

        assertEquals(success, true);
        assertEquals(invalidFields.length === 0, true);

        await User.create(body);

        const second = await Validator.validate(rules, body);

        assertEquals(second.success, false);
        assertEquals(second.invalidFields.length === 0, false);
        assertEquals(second.invalidFields[0].name, 'id');

        await User.where({ id: body.id }).delete();
        await db.close();
    }
});

Deno.test({
    name: 'Validator - missing fields (No DB)',
    fn: async () => {
        const rules: ValidationRules = {
            id: {
                uuid: true,
                gt: 2000,
                gte: 1500,
                lte: 3000,
                lt: 2800
            }
        };

        const body = {};

        const { success, invalidFields } = await Validator.validate(rules, body);

        assertEquals(success, false);
        assertEquals(invalidFields.length === 1, true);
        assertEquals(invalidFields[0].name === 'id', true);
    }
});
