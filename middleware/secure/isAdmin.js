import User from '../../models/user.js';
import { getUser } from '../../utils/getUser.js';
//middleware protection function to check if the user is an admin if we go with implementing the admin route
export const isAdmin = async (req, res, next) => {
    try {
        //get access token from headers
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        const user = await User.findOne({ _id: id });
        //send error if user not found
        if (!user) {
            return res.status(400).json({
                error: 'Unauthorized',
                message: 'Invalid Email/Password',
            });
        } else {
            //if user found but is not and admin then deny acccess
            if (user.isAdmin === false) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Access Not Allowed.',
                });
            } else if (user.isAdmin === true) {
                //if user found and is an admin then give access to the next middleware
                next();
            }
        }
    } catch (err) {
        next(err);
    }
};
