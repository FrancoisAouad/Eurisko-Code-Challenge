import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryName: {
        type: String,
        index: true,
    },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        index: true,
    },
    creatorName: {
        type: String,
    },
    creatorEmail: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model('category', categorySchema);
