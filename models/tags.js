import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    tagName: {
        type: String,
        required: true,
    },
    creatorsID: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user',
        },
    ],
});

tagSchema.index({ tagSchema: -1 });
tagSchema.index({ creatorsID: -1 });
export default mongoose.model('tags', tagSchema);
