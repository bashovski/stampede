// @ts-ignore
import FormField from '@/models/FormField';

export const initialFields: Array<FormField> = [
    new FormField(
        'email',
        'Email',
        'text',
        'Insert your email',
        'Please insert your email.'
    )
];

export const recoveryFields: Array<FormField> = [
    new FormField(
        'recoveryCode',
        'Recovery code from email',
        'text',
        'Insert the recovery code',
        'You should have received it in email. Please check your inbox and insert the code.'
    ),
    new FormField(
        'password',
        'New password',
        'password',
        'Insert the new password',
        'Your password\'s length has got to be between 7 and 50 characters. It can have most of special characters and must include at least one number and a capital letter/special character.'
    ),
];
