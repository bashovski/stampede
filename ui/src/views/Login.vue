<template>
    <div class="stampede-login">
        <form
                class="auth-form"
                @submit="(e) => e.preventDefault()"
        >
            <h1>
                Login
            </h1>
            <section>
                <label for="email">
                    Email
                </label>
                <input
                        v-model="loginData.email"
                        id="email"
                        type="text"
                        placeholder="Insert your email"
                >
            </section>
            <section>
                <label for="password">
                    Password
                </label>
                <input
                        v-model="loginData.password"
                        id="password"
                        :type="passwordType"
                        :autocomplete="passwordAutoCompletionFieldPseudoHash"
                        placeholder="Insert your password"
                >
                <img
                        class="password-type-toggle"
                        src="../assets/icons/eye.svg"
                        alt="Eye"
                        @click="invertPasswordType"
                >
            </section>
            <section
                    v-if="error"
                    class="error"
            >
                {{ error }}
            </section>
            <button @click="submit">
                LOGIN
            </button>
            <div class="sub-option">
                <RouterLink to="/recover">
                    Forgot Password?
                </RouterLink>
            </div>
        </form>
    </div>
</template>

<script>

    import Auth from '@/auth';
    import AuthApi from '@/api/auth';

    export default {
        name: 'Login',
        data() {
            return {
                loginData: {
                    email: '',
                    password: ''
                },
                isPasswordTypeToggled: true,
                error: null
            }
        },
        computed: {
            passwordType() {
                return this.isPasswordTypeToggled ? 'password' : 'text';
            },
            passwordAutoCompletionFieldPseudoHash() {
                return this.isPasswordTypeToggled ? 'password' : Math.random().toString(36).substring(7);
            }
        },
        methods: {
            async submit() {
                const { email, password } = this.loginData;

                if (!email.length) return this.error = 'You haven\'t inserted your email.';
                if (!password.length) return this.error = 'You haven\'t inserted your password.';

                const { err } = await AuthApi.login(email, password);

                if (err)
                    return this.error = err.response.data && err.response.data.message;

                await Auth.authenticate();
                await this.$router.push({ path: 'dashboard' });
            },
            invertPasswordType() {
                this.isPasswordTypeToggled = !this.isPasswordTypeToggled;
            }
        }
    }
</script>
