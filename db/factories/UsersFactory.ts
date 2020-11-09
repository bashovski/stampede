import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/mod.ts";

import Factory, { FactoryOptions } from '../../lib/Factory.ts';
import User from "../../models/User.ts";

/**
 * @summary Populates 'users' table with false records
 * @class UsersFactory
 */
class UsersFactory extends Factory {
    constructor() {
        const options: FactoryOptions = {
            model: User,
            persistenceCount: 100,
            fields: {
                id: faker.random.uuid,
                email: faker.internet.email,
                username: faker.internet.userName,
                password: '123456789',
                dateOfBirth: new Date('1-1-1990'),
                isVerified: false
            }
        };
        super(options);
    }
}

export default UsersFactory;
