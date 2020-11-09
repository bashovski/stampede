interface UserState {
    authenticationInvoked: boolean;
    isLoggedIn: boolean;
    username: string | null;
    avatar: string | null;
    isVerified: boolean;
}

const state: UserState = {
    authenticationInvoked: false,
    isLoggedIn: false,
    username: null,
    avatar: null,
    isVerified: false
};

const getters = {

    getAuthenticationInvokedStatus(): boolean {
        return state.authenticationInvoked;
    },

    getUsername(): string | null {
        return state.username;
    },

    getLoginStatus(): boolean {
        return state.isLoggedIn;
    },

    getAvatar(): string | null {
        return state.avatar;
    },

    getEmailVerifiedStatus(): boolean {
        return state.isVerified;
    }
};

const actions = {

    updateAuthenticationInvokedStatus({ commit }: any | {}, isInvoked: boolean): void {
        commit('mutateAuthenticationInvokedStatus', isInvoked);
    },

    updateUsername({ commit }: any | {}, username: string | null): void {
        commit('mutateUsername', username);
    },

    updateLoginStatus({ commit }: any | {}, status: boolean): void {
        commit('mutateLoginStatus', status);
    },

    updateAvatar({ commit }: any | {}, avatar: string | null): void {
        commit('mutateAvatar', avatar);
    },

    updateEmailVerifiedStatus({ commit }: any | {}, status: boolean): void {
        commit('mutateEmailVerifiedStatus', status);
    }
};

const mutations = {

    mutateAuthenticationInvokedStatus(state: UserState, isInvoked: boolean): void {
        state.authenticationInvoked = isInvoked;
    },

    mutateUsername(state: UserState, username: string | null): void {
        state.username = username;
    },

    mutateLoginStatus(state: UserState, status: boolean): void {
        state.isLoggedIn = status;
    },

    mutateAvatar(state: UserState, avatar: string | null): void {
        state.avatar = avatar;
    },

    mutateEmailVerifiedStatus(state: UserState, status: boolean): void {
        state.isVerified = status;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
