import User from '../../models/user.js';
import { getUser } from '../../utils/getUser.js';

export const isEmailVerified = async (req, res, next) => {
    try {
        //get access token from headers
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Invalid Email o Password.',
            });
            //give access if token is valid
        } else {
            if (user.isVerified === false) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Please verify your email.',
                });
            } else if (user.isVerified === true) {
                next();
            }
        }
    } catch (e) {
        next(e);
    }
};
