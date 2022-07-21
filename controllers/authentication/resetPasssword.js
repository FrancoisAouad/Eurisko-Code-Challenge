import User from '../../models/user.js';
import { resetPassSchema } from '../../middleware/validation/userValidation.js';
import { setResetPasswordToken } from '../jwt/configJWT.js';
import { verifyResetPasswordToken } from '../jwt/verifyJWT.js';
import bcrypt from 'bcrypt';
import nodemailer from '../../utils/nodemailer.js';

//SEND FORGOT PASSWORD EMAIL
export const forgotPassword = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        //check if user exists
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Account Not Found',
            });
            // throw createError.Unauthorized(`Account not found`);
        } else {
            const passwordToken = await setResetPasswordToken(user.id);

            nodemailer({
                from: process.env.NODEMAILER_USER,
                to: user.email,
                subject: 'Reset Password',
                html: `<h2> Dear, ${user.name}.</h2>
        <br/>
            <p>Your reset password link is available below.</p>
            <br/>
            <a href="http://${req.headers.host}/api/v1/auth/reset-password/${user.id}/${passwordToken}">Reset</a>`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Verification email sent to ${user.email}!`,
        });
    } catch (e) {
        next(e);
    }
};

//RESET PASSWORD
export const resetPassword = async (req, res, next) => {
    try {
        const { id, token } = req.params;
        const result = await resetPassSchema.validateAsync(req.body);

        const user = await User.findOne({ _id: id });
        if (user) {
            //verify that the password token is valid
            const userId = await verifyResetPasswordToken(token);
            //salt and hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(result.password, salt);
            user.password = hashedPassword;
            //update password in database
            const savedUser = await user.save();

            return res.status(201).json({
                success: true,
                message: 'Password Successfully Updated.',
            });
        }
    } catch (e) {
        if (e.isJoi === true) e.status = 422;
        next(e);
    }
};
