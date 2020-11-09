import { getValidatorByKey } from '@/services/validation';

class FormField {

    fieldKey: string;
    name: string;
    type: string;
    placeholder: string;
    instructions: string | null;
    validator: any;

    constructor(
        fieldKey: string,
        name: string,
        type = 'text',
        placeholder: string,
        instructions: string | null,
        validator = null,
    ) {
        this.fieldKey = fieldKey;
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
        this.validator = validator || getValidatorByKey(name);
        this.instructions = instructions;
    }
}

export default FormField;
