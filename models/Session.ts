import { DataTypes } from 'https://deno.land/x/denodb/mod.ts';
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { createHash } from 'https://deno.land/std/hash/mod.ts';
import moment from 'https://cdn.skypack.dev/moment';
import Cookie from '../lib/Cookie.ts';
import Config from '../lib/Config.ts';
import Model from '../lib/Model.ts';

class Session extends Model {

    static table = 'sessions';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 128,
            unique: true
        },
        expiresAt: {
            type: DataTypes.DATETIME,
            allowNull: false
        }
    };

    public static async generate(userId : any): Promise<Session> {

        const id = v4.generate();
        const expiresAt = new Date();

        const tokenHash = createHash('md5');
        tokenHash.update(`${userId}${new Date().getTime()}${id}`);

        const token = tokenHash.toString('base64');

        return this.create({
            id,
            userId,
            token,
            expiresAt
        });
    }

    public getCookie(): Cookie {

        const isDev = Config.getEnvironment() === 'dev';
        const expires = moment().add(31, 'days').toDate();

        // @ts-ignore
        return new Cookie(Config.getSessionCookieName(), this.token, isDev ? {
            expires,
            path: '/'
        } : {
            domain: Config.getApiUrl(),
            sameSite: true,
            expires,
            secure: true,
            path: '/'
        });
    }
}

export default Session;
