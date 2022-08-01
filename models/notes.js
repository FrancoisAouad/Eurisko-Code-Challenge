import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        // index: true,
    },
    content: {
        type: String,
        // index: true,
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
        // index: true,
    },

    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // index: true,
    },
    creatorName: {
        type: String,
    },
    creatorEmail: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
    updatedDate: {
        type: Date,
        default: Date.now(),
    },
});
//index for getNotes
noteSchema.index({ category: -1, creatorID: -1, tags: -1 });
noteSchema.index({ creatorID: -1, tags: -1 });
noteSchema.index({ category: -1, creatorID: -1 });
//compund schema index for aggregation
noteSchema.index({
    creatorID: -1,
    creatorName: -1,
});
export default mongoose.model('notes', noteSchema);
