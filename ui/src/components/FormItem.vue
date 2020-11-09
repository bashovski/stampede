<template>
    <section class="stampede-form-item">
        <label :for="fieldKey">
            {{ name }}
        </label>
        <Datepicker
                v-if="isDatepicker"
                v-model="value"
                :id="fieldKey"
                class="datepicker"
                @selected="date => $emit('input', date)"
        ></Datepicker>
        <input
                v-else
                v-model="value"
                :id="fieldKey"
                :type="fieldType"
                :autocomplete="autoCompletion"
                :placeholder="placeholder"
                v-tooltip.top-center="tooltipOptions"
                @input="$emit('input', $event.target.value)"
        >
        <img
                v-if="isPassword"
                class="password-type-toggle"
                src="../assets/icons/eye.svg"
                alt="Eye"
                @click="invertPasswordType"
        >
        <section
                v-if="error"
                class="field-error"
        >
            {{ error }}
        </section>
    </section>
</template>

<script>
    import Datepicker from '@hokify/vuejs-datepicker';
    export default {
        name: "FormItem",
        components: {
            Datepicker
        },
        props: {
            fieldKey: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                default: 'text'
            },
            placeholder: {
                type: String,
                required: false
            },
            validator: {
                type: Function,
                required: false
            },
            serverSideValidationError: {
                type: String,
                default: null
            },
            error: {
                type: String,
                required: false
            },
            instructions: {
                type: String,
                required: false,
                default: null
            }
        },
        data() {
            return {
                value: this.type === 'datepicker' ? new Date() : '',
                isPasswordTypeToggled: true
            }
        },
        computed: {
            isDatepicker() {
                return this.type === 'datepicker';
            },
            isPassword() {
                return this.type === 'password';
            },
            fieldType() {
                return this.isPassword ? this.passwordType : this.type;
            },
            autoCompletion() {
                return this.isPassword ? this.passwordAutoCompletionFieldPseudoHash : this.fieldKey;
            },
            passwordType() {
                return this.isPasswordTypeToggled ? 'password' : 'text';
            },
            passwordAutoCompletionFieldPseudoHash() {
                return this.isPasswordTypeToggled ? 'password' : Math.random().toString(36).substring(7);
            },
            tooltipOptions() {
                return {
                    content: this.instructions,
                    class: 'tooltip'
                };
            }
        },
        methods: {
            invertPasswordType() {
                this.isPasswordTypeToggled = !this.isPasswordTypeToggled;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../node_modules/@hokify/vuejs-datepicker/dist/vuejs-datepicker.css";
</style>
