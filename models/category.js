import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        // index: true,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
    updatedDate: {
        type: Date,
        default: Date.now(),
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
});
//for aggregation in admin.js
categorySchema.index({
    creatorID: -1,
    creatorName: -1,
});
//for find query in category.js
categorySchema.index({ creatorID: -1 });
categorySchema.index({ categoryName: -1 });
categorySchema.index({ updatedDate: -1 });
export default mongoose.model('category', categorySchema);
