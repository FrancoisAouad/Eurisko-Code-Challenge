import crypto from 'crypto';
//generate tokens using crypto module
const accessTokenSecret = crypto.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');
const resetPasswordTokenSecret = crypto.randomBytes(32).toString('hex');
//log tokens into a table
console.table({
    accessTokenSecret,
    refreshTokenSecret,
    resetPasswordTokenSecret,
});
