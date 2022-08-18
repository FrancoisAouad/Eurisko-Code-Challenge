import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
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
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },

    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
