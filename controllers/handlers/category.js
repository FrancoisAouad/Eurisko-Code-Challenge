import Category from '../../models/category.js';
import { categorySchema } from '../../middleware/validation/categoryValidation.js';
import user from '../../models/user.js';
import { getUser } from '../../utils/getUser.js';

//ADD CATEGORY
export const addCategory = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        //validate input
        const { categoryName } = await categorySchema.validateAsync(req.body);
        const category = await Category.findOne({ categoryName: categoryName });

        const UserInfo = await user.findOne({ _id: id });
        //category already exists in db
        if (category) {
            return res.status(409).json({
                success: false,
                error: 'Conflict',
                message: 'Category already exists..',
            });
        }
        //create new category document
        const categ = new Category({
            categoryName: categoryName,
            creatorID: id,
            creatorName: UserInfo.name,
            creatorEmail: UserInfo.email,
        });
        //save in collection
        const newcategory = await categ.save();

        res.status(201).json({
            success: true,
            message: 'New Category created!',
            data: newcategory,
        });
    } catch (e) {
        next(e);
    }
};
//DELETE CATEGORY
export const deleteCategory = async (req, res, next) => {
    try {
        //get specific category id
        const id = req.params.categoryId;

        const category = await Category.findOne({ _id: id });

        //return not found
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'Category not found',
            });
        } else {
            //delete category if it exists
            const deleteCategory = await Category.deleteOne({ _id: id });

            res.status(201).json({
                success: true,
                message: 'Successfully Deleted',
                data: category,
            });
        }
    } catch (e) {
        next(e);
    }
};
//FIND ALL CATEGORIES
export const getCategories = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        const categories = await Category.find({ creatorID: { $eq: id } });
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (e) {
        next(e);
    }
};
//UPDATE CATEGORY
export const editCategory = async (req, res, next) => {
    try {
        //validate updated user input
        const newCategory = await categorySchema.validateAsync(req.body);
        const category = await Category.findByIdAndUpdate(
            req.params.categoryId,
            newCategory,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Category updated!',
            data: category,
        });

        if (!category)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'Category not found..',
            });
    } catch (e) {
        next(e);
    }
};
