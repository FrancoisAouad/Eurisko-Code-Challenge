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
const path = 'category';

router.post(`/${path}`, verifyAccessToken, isEmailVerified, addCategory);
router.get(`/${path}`, verifyAccessToken, isEmailVerified, getCategories);
router.put(
    `/${path}/:categoryId`,
    verifyAccessToken,
    isEmailVerified,
    isCategoryPermitted,
    editCategory
);
router.delete(
    `/${path}/:categoryId`,
    verifyAccessToken,
    isEmailVerified,
    isCategoryPermitted,
    deleteCategory
);

export default router;
