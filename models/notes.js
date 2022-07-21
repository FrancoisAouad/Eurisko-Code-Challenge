import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        index: true,
    },
    content: {
        type: String,
        index: true,
    },
    tags: [{ type: String, index: true }],
    imageLocation: [
        {
            type: String,
            default: null,
        },
    ],
    attachementLocation: [
        {
            type: String,
            default: null,
        },
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
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
    date: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model('notes', noteSchema);
