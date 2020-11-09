import Setting from '../../models/Setting';
import SettingsField from '../../models/SettingsField';

export default [
    new Setting('Account', [
        new SettingsField('Username', 'text', null, -1, -1),
        new SettingsField('Email', 'email', null, -1, -1),
        new SettingsField('Date of Birth', 'datepicker', null, -1, -1),
        new SettingsField('Password', 'password', null, -1, -1),
    ]),
    new Setting('Security', [])
];
