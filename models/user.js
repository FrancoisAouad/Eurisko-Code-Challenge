import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    emailToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

UserSchema.pre('save', async function (next) {
    try {
        //  add hashed password into database
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function (password) {
    try {
        //compare input password with hashed pass in db
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        throw new Error('New Error');
    }
};
UserSchema.index({ email: -1 });
UserSchema.index({ emailToken: -1 });
export default mongoose.model('user', UserSchema);
