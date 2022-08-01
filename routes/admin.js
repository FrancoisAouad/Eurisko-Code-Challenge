import express from 'express';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT.js';
import { isEmailVerified } from '../middleware/secure/isUserVerified.js';

import {
    addCategory,
    deleteCategory,
    editCategory,
    getCategories,
} from '../controllers/handlers/category.js';
import { isAdmin } from '../middleware/secure/isAdmin.js';
import {
    getNbOfUserCategory,
    getNbOfUserTags,
} from '../controllers/handlers/admin.js';
const router = express.Router();
router.get(
    '/users-categoryUsed',
    verifyAccessToken,
    isEmailVerified,
    getNbOfUserCategory
);
router.get(
    '/users-tagsUsed',
    verifyAccessToken,
    isEmailVerified,
    getNbOfUserTags
);
// router.post(
//     '/category/add-Category',
//     verifyAccessToken,
//     isEmailVerified,
//     isAdmin,
//     addCategory
// );

// router.get(
//     '/categories',
//     verifyAccessToken,
//     isEmailVerified,
//     isAdmin,
//     getCategories
// );

// router.put(
//     '/category/edit-Category/:categoryId',
//     verifyAccessToken,
//     isEmailVerified,
//     isAdmin,
//     editCategory
// );

// router.delete(
//     '/category/delete-Category/:categoryId',
//     verifyAccessToken,
//     isEmailVerified,
//     isAdmin,
//     deleteCategory
// );

export default router;
