<template>
    <div class="stampede-recover">
        <form
                class="auth-form"
                @submit="(e) => e.preventDefault()"
        >
            <h1>
                Recover Account
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
            <button @click="recover">
                {{ buttonStr }}
            </button>
            <div class="sub-option">
                All good?
                <RouterLink
                        style="margin-left: 0.5em"
                        to="/login"
                >
                    Sign back in.
                </RouterLink>
            </div>
        </form>
    </div>
</template>

<script>

    import Auth from '@/auth';
    import AuthApi from '@/api/auth';
    import StorageSvc from '@/services/storage';
    import { initialFields, recoveryFields } from '@/services/recover';
    import FormMixin from '@/mixins/forms';

    export default {
        name: "RecoverAccount",
        components: {
            FormItem: () => import('../components/FormItem')
        },
        mixins: [FormMixin],
        data() {
            return {
                formFields : initialFields,
                error: null,
                step: 1
            };
        },
        computed: {
            buttonStr() {
                return this.step === 1 ? 'SEND CODE' : 'SET NEW PASSWORD';
            },
        },
        methods: {
            async recover() {
                this.resetErrors(this.formFields);
                const { err } = await (this.step === 1 ? AuthApi.requireRecovery : AuthApi.recover)(
                    ...this.formFields.map(field => field.value)
                );

                if (err) {
                    if (err.response.data.message) return this.error = err.response.data.message;
                    return this.formFields = this.handleFormRequestError(err, this.formFields);
                }

                if (this.step === 1) {
                    this.step++;
                    this.formFields = recoveryFields;
                    return;
                }

                await this.$router.replace('/');
            }
        }
    }
</script>
