import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { DataTypes } from 'https://deno.land/x/denodb/mod.ts';
import moment from 'https://cdn.skypack.dev/moment';
import Random from 'https://deno.land/x/random@v1.1.2/Random.js';
import Mail, { MailSenderRecipient, MailOpts } from '../lib/Mail.ts';
import Model from '../lib/Model.ts';
import User from "./User.ts";
import Logger from "../lib/Logger.ts";

export const VERIFICATION_TOKEN_LENGTH = 6;

class Verification extends Model {
    static table = 'verifications';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            length: 6,
            unique: false
        },
        expiresAt: {
            type: DataTypes.DATETIME,
            allowNull: false
        }
    };

    /**
     * @summary Generates a new Verification for a user.
     *          If there's already a one related to the user, it skips the new insertion to the database and rather retrieves the old one.
     * @param userId
     * @returns <Verification | null>
     */
    public static async generate(userId: string): Promise<Verification | null> {

        const [ user ] = await User.where({
            id: userId
        }).take(1).get();

        if (!user) return null;

        let [ verification ] = await Verification.where({
            userId
        }).take(1).get();

        const id = v4.generate();

        const token = new Random().string(VERIFICATION_TOKEN_LENGTH, (Random as any).UNAMBIGOUS_UPPER_ALPHA_NUMERICS);

        const expiresAt = moment().add(14, 'days').toDate();

        /**
         * Creates a new verification resource if it hasn't been already created, otherwise updates the old one.
         */
        if (!verification)
            verification = await this.create({
                id,
                userId,
                token,
                expiresAt
            });
        else await this.where({
            userId
        }).update({
            expiresAt
        });

        const { username, email } = user;

        /**
         * Configures and sends a verification email
         */
        const sender: MailSenderRecipient = {
            name: 'Stampede Bot',
            email: 'anurbasic01@outlook.com'
        }

        const recipient: MailSenderRecipient = {
            name: username,
            email
        };

        const opts: MailOpts = {
            templateId: 'd-70944ef8742f4bfc8441f53ae9b93480',
            dynamicTemplateData: {
                username,
                token: verification.token || token
            }
        };

        const { err }: any = await new Mail(opts).from(sender).to(recipient).send();

        if (err)
            Logger.error(`Verification email sending failed`, {
                username,
                userId,
                email,
                error: err
            });

        return verification;
    }
}

export default Verification;
