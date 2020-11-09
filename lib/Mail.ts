import Config from './Config.ts';
import FeatureFlags from "./FeatureFlags.ts";

const MAIL_SVC_BASE_URL = 'https://api.sendgrid.com/v3';

export interface MailOpts {
    subject?: string,
    templateId?: string,
    content?: Array<MailContentItem>,
    attachments?: Array<any>,
    dynamicTemplateData?: object,
    sendAt?: number
}

export interface MailSenderRecipient {
    name?: string,
    email: string
}

export interface MailContentItem {
    type: string,
    value: string
}

/**
 * @summary Supports integration with SendGrid. Compatible only with V3 API.
 * @todo Add support for other services (on-request, submit an issue: https://github.com/bashovski/stampede/issues/new)
 * @class Mail
 */
class Mail {

    // https://sendgrid.com/docs/API_Reference/api_v3.html

    private readonly subject?: string;
    private readonly templateId?: string;
    private readonly content?: Array<MailContentItem>;
    private readonly attachments?: Array<any>;
    private readonly sendAt?: number;
    private readonly personalizations?: Array<any>;

    /**
     * @summary All fields involving persons/parties in the mail.
     */
    private sendingFrom?: MailSenderRecipient;
    private replyingTo?: MailSenderRecipient;

    constructor(opts: MailOpts) {

        this.personalizations = [];

        this.subject = opts.subject ? opts.subject : 'Untitled Email';

        if (this.subject.length < 1 || this.subject.length > 78)
            throw 'A subject of an email should not exceed 78 and should have at least one character';

        if (opts.templateId)
            this.templateId = opts.templateId;

        else
            this.content = opts.content;

        if (opts.attachments)
            this.attachments = opts.attachments;

        if (opts.dynamicTemplateData) {
            this.personalizations[0] = {
                ...this.personalizations[0],
                ...{
                    dynamic_template_data: opts.dynamicTemplateData
                }
            }
        }

        if (opts.sendAt) {
            if (opts.sendAt > (new Date().getTime() + (72 * 60 * 60 * 100)))
                throw 'Emails cannot be scheduled more than 72h in advance';

            this.sendAt = opts.sendAt;
        }
    }

    public from(sender: MailSenderRecipient): Mail {
        this.sendingFrom = sender;
        return this;
    }

    private mutatePersonalizations(propName: string, recipients: Array<MailSenderRecipient> | MailSenderRecipient): Mail {

        if (!this.personalizations) return this;

        this.personalizations[0] = {
            ...this.personalizations[0],
            [propName]: (
                Array.isArray(recipients) ? recipients : [recipients] as any
            ).map(
                (recipient: MailSenderRecipient) => recipient
            ) as any
        }
        return this;
    }

    public to(recipients: Array<MailSenderRecipient> | MailSenderRecipient): Mail {
        return this.mutatePersonalizations('to', recipients);
    }

    public cc(recipients: Array<MailSenderRecipient> | MailSenderRecipient): Mail {
        return this.mutatePersonalizations('cc', recipients);
    }

    public bcc(recipients: Array<MailSenderRecipient> | MailSenderRecipient): Mail {
        return this.mutatePersonalizations('bcc', recipients);
    }

    public replyTo(replyParty: MailSenderRecipient): Mail {
        this.replyingTo = replyParty;
        return this;
    }

    private isValidMail(): boolean {
        return !(!this.sendingFrom || !this.sendingFrom.email);
    }

    public async send(): Promise<object> {

        if (!FeatureFlags.isFeatureEnabled('mailsEnabled'))
            return {};

        if (!this.isValidMail())
            return {
                err : 'Email is not valid. Sending aborted.'
            };

        const body = {
            personalizations: this.personalizations,
            from: this.sendingFrom,
            reply_to: this.replyingTo || undefined,
            subject: this.subject,
            content: this.content || undefined,
            attachments: this.attachments || undefined,
            template_id: this.templateId,
            send_at: this.sendAt || undefined
        };

        fetch(`${MAIL_SVC_BASE_URL}/mail/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Config.getSendGridApiKey()}`
            },
            body: JSON.stringify(body)
        })
        .then(async () => ({}))
        .catch(async err => ({ err }));
        return {};
    }
}

export default Mail;
