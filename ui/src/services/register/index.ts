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
        'username',
        'Username',
        'text',
        'Insert your username',
        'Your username can contain alphanumeric characters, underscores and hyphens. It cannot start or end with non-alphanumeric characters.'
    ),
    new FormField(
        'dateOfBirth',
        'Date of Birth',
        'datepicker',
        'Select your date of birth',
        'Please insert your date of birth.'
    ),
    new FormField(
        'password',
        'Password',
        'password',
        'Insert your password',
        'Your password\'s length has got to be between 7 and 50 characters. It can have most of special characters and must include at least one number and a capital letter/special character.'
    ),
    new FormField(
        'confirmPassword',
        'Confirm Password',
        'password',
        'Confirm your password',
	'Confirm your password.'
    ),
];
