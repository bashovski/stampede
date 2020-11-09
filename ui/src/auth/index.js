import AuthApi from '../api/auth.js';
import StorageSvc from '../services/storage';

class Auth {
    static async authenticate() {

        await StorageSvc.setAuthenticationInvokedStatus(true);

        const { data, err } = await AuthApi.IAM();

        /**
         * Interceptor handles the redirection and everything else.
         */
        if (err) return false;

        const { username, avatar } = data.user;

        await StorageSvc.setUserLoggedInStatus(true);
        await StorageSvc.setUsername(username);
        await StorageSvc.setAvatar(avatar);

        return true;
    }
}

export default Auth;
