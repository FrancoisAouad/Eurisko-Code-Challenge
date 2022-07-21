import express from 'express';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT.js';
import { isEmailVerified } from '../middleware/secure/isUserVerified.js';

import {
    addCategory,
    deleteCategory,
    editCategory,
    getCategories,
} from '../controllers/handlers/category.js';
import { isCategoryPermitted } from '../middleware/secure/isPermitted.js';

const router = express.Router();

//-----------------------CATEGORIES-----------------------//

/*-------CREATE-------*/
router.post(
    '/category/add-Category',
    verifyAccessToken,
    isEmailVerified,
    addCategory
);
/*-------READ-------*/
router.get('/categories', verifyAccessToken, isEmailVerified, getCategories);
/*-------UPDATE-------*/
router.put(
    '/category/edit-Category/:categoryId',
    verifyAccessToken,
    isEmailVerified,
    isCategoryPermitted,
    editCategory
);
/*-------DELETE-------*/
router.delete(
    '/category/delete-Category/:categoryId',
    verifyAccessToken,
    isEmailVerified,
    isCategoryPermitted,
    deleteCategory
);

export default router;
