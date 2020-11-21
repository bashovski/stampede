import { bcrypt } from '../deps.ts';

class CredentialsEncryption {
    static async encryptPassword(password : string) {
        return bcrypt.hash(password);
    }

    static async isPasswordCorrect(password : string, storedHash : string) {
        return bcrypt.compare(password, storedHash);
    }
}

export default CredentialsEncryption;
