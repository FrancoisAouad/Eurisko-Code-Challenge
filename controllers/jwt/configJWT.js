import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import client from '../../config/redisCon.js';

//ACCESS TOKEN
export const setAccessToken = (userId) => {
    //access token body
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.SECRET_ACCESS_TOKEN;
        const options = {
            expiresIn: '15m',
            issuer: 'eurisko-test.com',
            audience: userId,
        };
        //we create the jwt token alongside the callback as parameter
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
                return;
            }
            //we resolve the promise
            resolve(token);
        });
    });
};

//REFRESH TOKEN
export const setRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        //refresh token body
        const payload = {};
        const secret = process.env.SECRET_REFRESH_TOKEN;
        const options = {
            expiresIn: '1y',
            issuer: 'eurisko-test.com',
            audience: userId,
        };
        //we create the jwt token while calling the callback function
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
            }
            //we save the refrsh token inside of redis
            client.SET(
                userId,
                token,
                'EX',
                365 * 24 * 60 * 60,
                (err, reply) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return;
                    }
                    //we resolve the promise
                    resolve(token);
                }
            );
        });
    });
};

//RESET PASSWORD TOKEN
export const setResetPasswordToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.SECRET_RESETPASSWORD_TOKEN;
        const options = {
            expiresIn: '10m',
            issuer: 'eurisko-test.com',
            audience: userId,
        };
        //we create the jwt token alongside the callback as parameter
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                return reject(createError.InternalServerError());
                //return;
            }
            //we resolve the promise
            resolve(token);
        });
    });
};
