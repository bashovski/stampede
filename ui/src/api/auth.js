import http from '@/http';

const register = (body) => {
    return new Promise(resolve => {
        http.post('/users/register', body)
        .then(({ data }) => resolve({ data }))
        .catch(err => resolve({ err }));
    });
};

const login = (email, password) => {
    return new Promise(resolve => {
        http.post('/users/login', {
            email,
            password
        })
        .then(({ data }) => resolve({ data }))
        .catch(err => resolve({ err }));
    });
};

const IAM = () => {
    return new Promise(resolve => {
        http.get('/users/iam')
        .then(({ data }) => resolve({ data }))
        .catch(err => resolve({ err }));
    });
};

const logout = () => {
    return new Promise(resolve => {
        http.delete('/users/logout')
            .then((resp) => resolve({ success: resp.status === 204 }))
            .catch(err => resolve({ err }));
    });
}

const resetPassword = (email, oldPassword, newPassword) => {
    return new Promise(resolve => {
        http.patch('/users/password/reset', {
            email,
            oldPassword,
            newPassword
        })
        .then(resp => resolve({ success: true }))
        .catch(err => resolve({ err }))
    });
}

const verifyAccount = token => {
    return new Promise(resolve => {
        http.patch(`/users/${token}/verify`)
        .then((resp) => resolve({ success: resp.status === 200 }))
        .catch(err => resolve({ err }));
    });
}

const recover = (recoveryCode, password) => {
    return new Promise(resolve => {
        http.patch(`/users/account/recover`, {
            recoveryCode,
            password
        })
        .then((resp) => resolve({ success: resp.status === 200 }))
        .catch(err => resolve({ err }));
    })
}

const requireRecovery = email => {
    return new Promise(resolve => {
        http.patch(`/users/account/recover/code`, {
            email
        })
        .then((resp) => resolve({ success: resp.status === 200 }))
        .catch(err => resolve({ err }));
    })
}

export default {
    register,
    login,
    IAM,
    logout,
    resetPassword,
    verifyAccount,
    recover,
    requireRecovery
};
