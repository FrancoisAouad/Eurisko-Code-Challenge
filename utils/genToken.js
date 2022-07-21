import crypto from 'crypto';

const accessTokenSecret = crypto.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');
const resetPasswordTokenSecret = crypto.randomBytes(32).toString('hex');
console.table({
    accessTokenSecret,
    refreshTokenSecret,
    resetPasswordTokenSecret,
});
