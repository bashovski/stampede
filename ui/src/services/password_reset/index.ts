// @ts-ignore
import FormField from '@/models/FormField';

export const formFields: Array<FormField> = [
    new FormField(
        'email',
        'Email',
        'text',
        'Insert your email',
        'Please insert your email.'
    ),
    new FormField(
        'oldPassword',
        'Current password',
        'password',
        'Insert your current password',
        ''
    ),
    new FormField(
        'newPassword',
        'New password',
        'password',
        'Insert the new password',
        'Your password\'s length has got to be between 7 and 50 characters. It can have most of special characters and must include at least one number and a capital letter/special character.'
    ),
];
