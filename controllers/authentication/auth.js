import crypto from 'crypto';
import User from '../../models/user.js';
import nodemailer from '../../utils/nodemailer.js';
import client from '../../config/redisCon.js';
import { verifyRefreshToken } from '../jwt/verifyJWT.js';
import {
    loginSchema,
    signupSchema,
} from '../../middleware/validation/userValidation.js';
import { setAccessToken, setRefreshToken } from '../jwt/configJWT.js';

//REGISTER
export const register = async (req, res, next) => {
    try {
        //validate user input
        const result = await signupSchema.validateAsync(req.body);
        //genarate encrypted email token to be used for account activation
        const newToken = crypto.randomBytes(64).toString('hex');
        //check if email already exists in database
        const exists = await User.findOne({ email: result.email });
        if (exists)
            return res.status(409).json({
                success: false,
                error: 'Conflict',
                message: ` ${result.email} has already been registered`,
            });

        const user = new User(result);

        //add token to db
        user.emailToken = newToken;
        const savedUser = await user.save();
        //generate access and refresh token by saving calling the methods and saving in variables
        const accessToken = setAccessToken(savedUser.id);
        const refreshToken = await setRefreshToken(savedUser.id);

        //ACTIVATION EMAIL TEMPLATE
        nodemailer({
            from: process.env.NODEMAILER_USER,
            to: result.email,
            subject: 'Email Verification',
            html: `<h2> Welcome, ${result.name}!</h2>
      <br/>
          <p>Thank you for registering, you are almost done. Please read the below message to continue.</p>
          <br/>
         <p>In order to confirm your email, kindly click the verification link below.</p>
          <br/>
        <a href="http://${req.headers.host}/api/v1/auth/verify?token=${user.emailToken}">Click here to verify</a>`,
        });
        //send jwt tokens to client
        res.status(200).send({ accessToken, refreshToken });
    } catch (e) {
        if (e.isJoi === true) e.status = 422;
        next(e);
    }
};
//LOGIN
export const login = async (req, res, next) => {
    try {
        //validate input
        const result = await loginSchema.validateAsync(req.body);
        //check if email exists
        const user = await User.findOne({ email: result.email });
        if (!user)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'User Not found',
            });
        //calls the isvalidpassword method in user model which compares the hashed password and inputed pass
        const isMatch = await user.isValidPassword(result.password);

        if (isMatch === false)
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid Email or Password',
            });
        //generate access and refresh token by saving calling the methods and saving in variables
        const accessToken = setAccessToken(user.id);
        // console.log(accessToken);
        const refreshToken = await setRefreshToken(user.id);
        // console.log(refreshToken);

        res.status(200).send({ accessToken, refreshToken });
    } catch (e) {
        if (e.isJoi === true) e.status = 422;
        next(e);
    }
};
//REFRESH TOKEN
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        //return error if refresh token isnt found
        if (!refreshToken)
            return res.status(400).json({
                success: false,
                error: 'BadRequest',
                message: 'Cannot verify credentials',
            });

        //else verify the current token
        const userId = await verifyRefreshToken(refreshToken);
        //if it passes then generate new tokens and send them to the user again
        const accessToken = setAccessToken(userId);
        const refToken = await setRefreshToken(userId);

        res.status(200).send({
            accessToken: accessToken,
            refreshToken: refToken,
        });
    } catch (error) {
        next(error);
    }
};
//LOGOUT
export const logout = async (req, res, next) => {
    try {
        //check refresh token
        const { refreshToken } = req.body;
        //return error if not found
        if (!refreshToken)
            return res.status(400).json({
                success: false,
                error: 'BadRequest',
                message: 'Cannot verify credentials',
            });
        //verify the refresh token if found
        const userId = await verifyRefreshToken(refreshToken);

        //delete refresh token to logout
        client.DEL(userId, (error, val) => {
            if (error) {
                console.log(error.message);
                return res
                    .status(500)
                    .json({ success: false, error: 'InternalServerError' });
            }
        });
        return res.status(204).json({ success: true });
    } catch (e) {
        next(e);
    }
};
