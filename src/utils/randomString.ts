import crypto from 'crypto';

export default function randomString(num: number) {
    const string = crypto.randomBytes(num).toString('hex').slice(0, num);
    return string;
}
