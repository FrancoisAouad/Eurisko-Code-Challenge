// import Category from '../../models/category.js';
// import { categorySchema } from '../../middleware/validation/categoryValidation.js';
// import user from '../../models/user.js';
// import { getUser } from '../../utils/getUser.js';
import notes from '../../models/notes.js';
// export const addCategory = async (req, res, next) => {
//     try {
//         const authHeader = req.headers['authorization'];
//         const id = getUser(authHeader);
//         //validate input
//         const { categoryName } = await categorySchema.validateAsync(req.body);
//         const category = await Category.findOne({ categoryName: categoryName });

//         const UserInfo = await user.findOne({ _id: id });
//         //category already exists in db
//         if (category) {
//             return res.status(409).json({
//                 success: false,
//                 error: 'Conflict',
//                 message: 'Category already exists..',
//             });
//         }
//         //create new category document
//         const categ = new Category({
//             categoryName: categoryName,
//             creatorID: id,
//             creatorName: UserInfo.name,
//             creatorEmail: UserInfo.email,
//         });
//         //save in collection
//         const newcategory = await categ.save();

//         res.status(201).json({
//             success: true,
//             message: 'New Category created!',
//             data: newcategory,
//         });
//     } catch (e) {
//         next(e);
//     }
// };

// export const deleteCategory = async (req, res, next) => {
//     try {
//         //get specific category id
//         const id = req.params.categoryId;

//         const category = await Category.findOne({ _id: id });

//         //return not found
//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'NotFound',
//                 message: 'Category not found',
//             });
//         } else {
//             //delete category if it exists
//             const deleteCategory = await Category.deleteOne({ _id: id });

//             res.status(201).json({
//                 success: true,
//                 message: 'Successfully Deleted',
//                 data: category,
//             });
//         }
//     } catch (e) {
//         next(e);
//     }
// };

// export const getCategories = async (req, res, next) => {
//     try {
//         const authHeader = req.headers['authorization'];
//         const id = getUser(authHeader);

//         const categories = await Category.find({});
//         res.status(200).json({
//             success: true,
//             count: categories.length,
//             data: categories,
//         });
//     } catch (e) {
//         next(e);
//     }
// };

// export const editCategory = async (req, res, next) => {
//     try {
//         //validate updated user input
//         const newCategory = await categorySchema.validateAsync(req.body);
//         const category = await Category.updateOne(
//             req.params.categoryId,
//             newCategory,
//             {
//                 new: true,
//                 runValidators: true,
//             }
//         );

//         res.status(200).json({
//             success: true,
//             message: 'Category updated!',
//             data: category,
//         });

//         if (!category)
//             return res.status(404).json({
//                 success: false,
//                 error: 'NotFound',
//                 message: 'Category not found..',
//             });
//     } catch (e) {
//         next(e);
//     }
// };

/* In case of choosing to go the admin route where the admin adds pre determined categories, all the CRUD operations will be available to the admin, whereas only the GET and DELETE operations will be available to the user   */
/* the user will be able to remove a category by choosing the default 'none' category in this case */
/* else if the user is the one who adds all the categoriies instead,  then they will have to delete all notes attributed to it  */
export const getNbOfUserCategory = async (req, res, next) => {
    try {
        //group all notes by their categories
        //first check the only the first document with these fields if there is repition in the collection
        //sum adds 1 each time the aggregation pipeline finds a matching documents
        const getNbr = await notes.aggregate([
            {
                $group: {
                    _id: '$category',
                    total: { $sum: 1 },
                    creatorName: { $first: '$creatorName' },
                    creatorID: { $first: '$creatorID' },
                },
            },
        ]);

        return res.status(200).json({ success: true, data: getNbr });
    } catch (e) {
        next(e);
    }
};

export const getNbOfUserTags = async (req, res, next) => {
    try {
        //admin can insert the tags that they want to check
        //the result from the pipline must return the notes that match the input tags
        const { tags } = req.body;
        const getNbr = await notes.aggregate([
            { $match: { tags: { $all: tags } } },
            {
                $group: {
                    _id: '$tags',
                    total: { $sum: 1 },
                    creatorName: { $first: '$creatorName' },
                    creatorID: { $first: '$creatorID' },
                },
            },
        ]);

        return res.status(200).json({ success: true, data: getNbr });
    } catch (e) {
        next(e);
    }
};
