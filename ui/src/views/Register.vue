<template>
    <div class="stampede-register">
        <form
                class="auth-form"
                @submit="(e) => e.preventDefault()"
        >
            <h1>
                Register
            </h1>
            <FormItem
                v-for="(item, key) in formFields"
                :key="key"
                v-bind="item"
                v-model="formFields[key].value"
            />
            <button @click="register">
                SIGN UP
            </button>
            <div class="sub-option">
                Already have an account?
                <RouterLink
                        style="margin-left: 0.5em"
                        to="/login"
                >
                    Sign in.
                </RouterLink>
            </div>
        </form>
    </div>
</template>

<script>

    import Auth from '@/auth';
    import AuthApi from '@/api/auth';
    import { formFields } from '@/services/register';
    import FormMixin from '@/mixins/forms';

    export default {
        name: "Register",
        components: {
            FormItem: () => import('../components/FormItem')
        },
        mixins: [FormMixin],
        data() {
            return {
                formFields
            }
        },
        methods: {
            async register() {

                this.resetErrors(this.formFields);

                const body = {};
                for(const field of this.formFields) {
                    body[field.fieldKey] = field.value;
                }

                if (body.confirmPassword !== body.password) {
                    const passwordField = this.formFields.findIndex(field => field.fieldKey === 'password');
                    this.formFields[passwordField].error = 'Provided passwords do not match';
                    this.$forceUpdate();
                    return;
                }

                const { err } = await AuthApi.register(body);

                if (err)
                    return this.formFields = this.handleFormRequestError(err, this.formFields);

                await Auth.authenticate();
                await this.$router.push({ path: 'dashboard' });
            }
        }
    }
</script>
