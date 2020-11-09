const isValidEmail = (email: string) => email.match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
const isValidPassword = (password: string) => password.match(/^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{7,50}$/);

const validators: any = {
    email: isValidEmail,
    password: isValidPassword
};

/**
 * @summary Ideally consumes a field key or label to access and retrieve an according validator.
 * @param key
 */
export const getValidatorByKey = (key: string): any => Object.prototype.hasOwnProperty.call(validators, key) ? validators[key] : null;

export default {
    isValidEmail,
    isValidPassword,
};
