<template>
    <div class="stampede-forgot-password">
        <form
                class="auth-form"
                @submit="(e) => e.preventDefault()"
        >
            <h1>
                Reset Password
            </h1>
            <FormItem
                    v-for="(item, key) in formFields"
                    :key="key"
                    v-bind="item"
                    v-model="formFields[key].value"
            />
            <section
                    v-if="error"
                    class="error"
            >
                {{ error }}
            </section>
            <button @click="resetPassword">
                RESET PASSWORD
            </button>
        </form>
    </div>
</template>

<script>

    import Auth from '@/auth';
    import AuthApi from '@/api/auth';
    import StorageSvc from '@/services/storage';
    import { formFields } from '@/services/password_reset';
    import FormMixin from '@/mixins/forms';

    export default {
        name: "ResetPassword",
        components: {
            FormItem: () => import('../components/FormItem')
        },
        mixins: [FormMixin],
        data() {
            return {
                formFields,
                error: null
            };
        },
        methods: {
            async resetPassword() {

                this.resetErrors(this.formFields);

                const { err } = await AuthApi.resetPassword(
                    ...formFields.map(field => field.value)
                );

                if (err) {
                    if (err.response.data.message) return this.error = err.response.data.message;
                    return this.formFields = this.handleFormRequestError(err, this.formFields);
                }

                await this.$router.replace('/');
            }
        }
    }
</script>

<style scoped>

</style>
