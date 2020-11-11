import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { DataTypes } from 'https://raw.githubusercontent.com/Otomatto/denodb/master/mod.ts';
import Random from 'https://deno.land/x/random@v1.1.2/Random.js';
import Mail, { MailSenderRecipient, MailOpts } from '../lib/Mail.ts';
import Model from '../lib/Model.ts';
import User from "./User.ts";
import Logger from "../lib/Logger.ts";

export const RECOVERY_TOKEN_LENGTH = 12;

class Recovery extends Model {
    static table = 'recoveries';
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
            length: RECOVERY_TOKEN_LENGTH,
            unique: false
        }
    };

    /**
     * @summary Generates a new Recovery for a user.
     *          If there's already a one related to the user, it skips the new insertion to the database and rather retrieves the old one.
     * @param userId
     * @returns <Recovery | null>
     */
    public static async generate(userId: string): Promise<Recovery | null> {

        const [ user ] = await User.where({
            id: userId
        }).take(1).get();

        if (!user) return null;

        let [ recovery ] = await Recovery.where({
            userId
        }).take(1).get();

        const id = v4.generate();
        const token = new Random().string(RECOVERY_TOKEN_LENGTH, (Random as any).UNAMBIGOUS_UPPER_ALPHA_NUMERICS);

        /**
         * Creates a new recovery resource if it hasn't been already created, otherwise updates the old one.
         */
        if (!recovery)
            recovery = await this.create({
                id,
                userId,
                token
            });

        const { username, email } = user;

        /**
         * Configures and sends a recovery email
         */
        const sender: MailSenderRecipient = {
            name: 'Stampede Bot',
            email: 'youremail@yourdomain.com'
        }

        const recipient: MailSenderRecipient = {
            name: username,
            email
        };

        const opts: MailOpts = {
            templateId: 'd-70944ef8742f4bfc8441f53ae9b93480',
            dynamicTemplateData: {
                username,
                token: recovery.token || token
            }
        };

        const { err }: any = await new Mail(opts).from(sender).to(recipient).send();

        if (err)
            Logger.error(`Recovery email sending failed`, {
                username,
                userId,
                email,
                error: err
            });

        return recovery;
    }
}

export default Recovery;
