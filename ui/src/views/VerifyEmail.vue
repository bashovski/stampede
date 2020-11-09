<template>
    <div class="stampede-verify-email">
        <form
                class="auth-form"
                @submit="(e) => e.preventDefault()"
        >
            <h1>
                Verify Email
            </h1>
            <label>
                Insert the verification token:
            </label>
            <section class="vertical-digits">
                <input
                        v-for="key in 6"
                        :key="key"
                        v-model="tokenDigits[key]"
                        type="text"
                        maxlength="1"
                        :ref="'input_' + key"
                        @keyup="triggerInputTransition(key)"
                >
            </section>
            <section
                    v-if="error"
                    class="error"
            >
                {{ error }}
            </section>
            <button @click="verifyEmail">
                VERIFY EMAIL
            </button>
        </form>
    </div>
</template>

<script>

    import AuthApi from '../api/auth';
    import StorageSvc from '../services/storage';

    export default {
        name: "VerifyEmail",
        data() {
            return {
                tokenDigits: [],
                keepAttempt: false,
                error: null,
                tokenLength: 6
            }
        },
        methods: {
            async verifyEmail() {

                const token = this.tokenDigits.join('');
                if (!token || token.length !== this.tokenLength)
                    this.error = 'Please insert the token.';

                this.error = null;
                const { err } = await AuthApi.verifyAccount(token);

                if (err)
                    return this.error = err.response.data && err.response.data.message;

                await StorageSvc.setEmailVerifiedStatus(true);
                await this.$router.replace('/');

            },
            triggerInputTransition(inputKey) {
                const fieldValue = this.tokenDigits[inputKey];
                if (!fieldValue || !fieldValue.length) {
                    if (this.keepAttempt) {
                        if (!this.$refs[`input_${inputKey > 0 ? inputKey - 1 : inputKey}`]) return;
                        this.$refs[`input_${inputKey > 0 ? inputKey - 1 : inputKey}`][0].focus();
                        this.keepAttempt = false;
                        return;
                    }
                    this.keepAttempt = true;
                    return;
                }
                if (fieldValue.length > 1) {
                    this.tokenDigits[inputKey] = this.tokenDigits[inputKey][0];
                    this.$forceUpdate();
                }
                this.keepAttempt = false;
                this.$refs[`input_${inputKey < 6 ? inputKey + 1 : inputKey}`][0].focus();
            }
        }
    }
</script>

<style scoped>

</style>
