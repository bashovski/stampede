const formsMixin = {
    methods: {

        handleFormRequestError(err: any, formFields: Array<any>): Array<any> {
            const data = err.response.data;
            if (data.invalidFields) {
                for (const field of data.invalidFields) {
                    const fieldIndex = formFields.findIndex((f: { fieldKey: any }) => f.fieldKey === field.name);
                    formFields[fieldIndex].error = field.error.replace(field.name, formFields[fieldIndex].name);
                }
                (this as any).$forceUpdate();
            }
            return formFields;
        },

        resetErrors(formFields: Array<any>) {
            return formFields.map(field => {
                delete field.error;
                return field;
            });
        }
    }
}

export default formsMixin;
