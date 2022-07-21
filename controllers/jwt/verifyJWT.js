import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import client from '../../config/redisCon.js';

//ACCESS TOKEN
export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return createError.Unauthorized();

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, payload) => {
        if (err) {
            const message =
                err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(new createError.Unauthorized(message));
        }
        req.payload = payload;
        next();
    });
};
//REFRESH TOKEN
export const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.SECRET_REFRESH_TOKEN,
            (err, payload) => {
                if (err) return reject(createError.Unauthorized());
                const userId = payload.aud;
                //fetch refresh token from redis
                client.GET(userId, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return;
                    }
                    if (refreshToken === result) return resolve(userId);
                    reject(createError.Unauthorized());
                });
            }
        );
    });
};

export const verifyResetPasswordToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.SECRET_RESETPASSWORD_TOKEN,
            (err, payload) => {
                if (err) return reject(createError.Unauthorized());
                //check payload information
                const userId = payload.aud;
                //if user doesn't exist reject token

                if (!userId) {
                    return reject(createError.Unauthorized());
                } else {
                    //else token is valid
                    resolve(userId);
                }
            }
        );
    });
};
