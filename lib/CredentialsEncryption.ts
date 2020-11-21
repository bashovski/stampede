import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

class CredentialsEncryption {
    static async encryptPassword(password : string) {
        return bcrypt.hash(password);
    }

    static async isPasswordCorrect(password : string, storedHash : string) {
        return bcrypt.compare(password, storedHash);
    }
}

export default CredentialsEncryption;
