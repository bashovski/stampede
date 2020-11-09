import store from '../../store';

export default {
    async setUserLoggedInStatus(status: boolean): Promise<void> {
        await store.dispatch('updateLoginStatus', status);
    },

    getUserLoggedInStatus(): boolean {
        return store.getters.getLoginStatus;
    },

    async setUsername(username: string | null): Promise<void> {
        await store.dispatch('updateUsername', username);
    },

    getUsername(): string | null {
        return store.getters.getUsername;
    },

    async setAvatar(avatar: string | null): Promise<void> {
        await store.dispatch('updateAvatar', avatar);
    },

    getAvatar(): string | null {
        return store.getters.getAvatar;
    },

    async setEmailVerifiedStatus(status: boolean): Promise<void> {
        await store.dispatch('updateEmailVerifiedStatus', status);
    },

    getEmailVerifiedStatus(): boolean {
        return store.getters.getEmailVerifiedStatus;
    },

    async clearUserData(): Promise<void> {
        await this.setUserLoggedInStatus(false);
        await this.setUsername(null);
        await this.setAvatar(null);
        await this.setEmailVerifiedStatus(false);
    },

    async setAuthenticationInvokedStatus(status = true): Promise<void> {
        await store.dispatch('updateAuthenticationInvokedStatus', status);
    },

    getAuthenticationInvokedStatus(): boolean {
        return store.getters.getAuthenticationInvokedStatus;
    }
};
