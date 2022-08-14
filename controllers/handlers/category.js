import Category from '../../models/category.js';
import { categorySchema } from '../../middleware/validation/categoryValidation.js';
import user from '../../models/user.js';
import { getUser } from '../../utils/getUser.js';
import Note from '../../models/notes.js';

//DELETE CATEGORY
export const deleteCategory = async (req, res, next) => {
    try {
        const categoryID = req.params.categoryId;
        //get logged in user
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        //check if category exists
        const category = await Category.find({
            creatorID: id,
            _id: categoryID,
        });
        //return message if it doesnt
        if (!category)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'No such category found.',
            });

        //find all notes that have used the category that is about to be deleted
        const notes = await Note.find({
            creatorID: id,
            category: categoryID,
        });

        //if the user has used this category at least once
        if (notes.length > 0) {
            //delete all notes that have used it
            await Note.deleteMany({
                creatorID: id,
                category: categoryID,
            });
            //then delete the category
            await Category.deleteOne({
                creatorID: id,
                _id: categoryID,
            });

            return res.status(200).json({
                success: true,
                message: `All notes with ${category.categoryName} category have been deleted.`,
            });
        } else {
            //if the category was never used, delete category directly
            await Category.deleteOne({
                creatorID: id,
                _id: categoryID,
            });

            return res.status(200).json({
                success: true,
                message: 'Category deleted.',
            });
        }
    } catch (e) {
        next(e);
    }
};

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
            category: newcategory,
        });
    } catch (e) {
        next(e);
    }
};

//FIND ALL CATEGORIES
export const getCategories = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        const categories = await Category.find({ creatorID: id }).sort({
            updatedDate: -1,
        });
        res.status(200).json({
            success: true,
            count: categories.length,
            categories: categories,
        });
    } catch (e) {
        next(e);
    }
};
// UPDATE CATEGORY
export const editCategory = async (req, res, next) => {
    try {
        //validate updated user input
        const newCategory = await categorySchema.validateAsync(req.body);
        const category = await Category.updateOne(
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
            category: category,
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
