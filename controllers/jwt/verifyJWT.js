import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import client from '../../config/redisCon.js';

//ACCESS TOKEN
export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return createError.Unauthorized();
    //we split the headers to get the jwt from the bearer token
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    //we verify if the token is valid
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, payload) => {
        if (err) {
            const message =
                err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(new createError.Unauthorized(message));
        }
        req.payload = payload;
        //go the next middleware if the token passes
        next();
    });
};

export const verifyRefreshToken = async (refreshToken) => {
    try {
        //verify refresh token
        const payload = jwt.verify(
            refreshToken,
            process.env.SECRET_REFRESH_TOKEN
        );
        const userId = payload.aud;
        //fetch saved refrsh token from cache
        const result = await client.GET(userId);
        //if refresh token is equal to the cached token, return id
        if (refreshToken === result) return userId;
        //else throw error
        throw createError.Unauthorized();
    } catch (error) {
        console.log(error.message);
        throw createError.InternalServerError();
    }
};

//PASSWORD TOKEN

export const verifyResetPasswordToken = async (refreshToken) => {
    try {
        //verify jwt token
        const payload = jwt.verify(
            refreshToken,
            process.env.SECRET_RESETPASSWORD_TOKEN
        );
        //get user id from payload
        const userId = payload.aud;
        if (!userId) {
            //throw error if user doesnt exist
            throw createError.Unauthorized();
        } else {
            //if user exists return id
            return userId;
        }
    } catch (error) {
        throw createError.Unauthorized();
    }
};
