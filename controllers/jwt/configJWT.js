import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import client from '../../config/redisCon.js';

//ACCESS TOKEN
export const setAccessToken = (userId) => {
    //access token body
    const payload = {};
    const secret = process.env.SECRET_ACCESS_TOKEN;
    const options = {
        expiresIn: '15m',
        issuer: 'eurisko-test.com',
        audience: userId,
    };
    //we sign and create the token and return its value
    const token = jwt.sign(payload, secret, options);
    return token;
};

export const setRefreshToken = async (userId) => {
    try {
        //refresh token body
        const payload = {};
        const secret = process.env.SECRET_REFRESH_TOKEN;
        const options = {
            expiresIn: '1y',
            issuer: 'eurisko-test.com',
            audience: userId,
        };
        //we save and create the token
        const token = jwt.sign(payload, secret, options);
        //we save the refrsh token inside of redis
        await client.SET(userId, token, 'EX', 365 * 24 * 60 * 60);
        //we return its value
        return token;
    } catch (err) {
        console.log(err.message);
        throw createError.InternalServerError();
    }
};

//RESET PASSWORD TOKEN
export const setResetPasswordToken = async (userId) => {
    try {
        //reset password token body and payload
        const payload = {};
        const secret = process.env.SECRET_RESETPASSWORD_TOKEN;
        const options = {
            expiresIn: '10m',
            issuer: 'eurisko-test.com',
            audience: userId,
        };
        //we sign the token
        const token = jwt.sign(payload, secret, options);
        //we return its value
        return token;
    } catch (error) {
        console.log(error.message);
        return createError.InternalServerError();
    }
};
