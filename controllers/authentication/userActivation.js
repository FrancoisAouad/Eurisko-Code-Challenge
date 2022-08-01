import User from '../../models/user.js';

export const verifyEmail = async (req, res, next) => {
    try {
        //check mongodb for token for this specific user
        const token = req.query.token;
        const user = await User.findOne({ emailToken: token });

        if (user) {
            //replace these values to show that a user is verified
            user.emailToken = 'null';
            user.isVerified = true;

            await user.save();
            //send message that req was successful
            return res.status(200).json({
                success: true,
                message: 'Email Successfully Verified!',
            });
        } else {
            //return error message if user not found in db
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Failed to Verify Email.',
            });
        }
    } catch (e) {
        next(e);
    }
};
