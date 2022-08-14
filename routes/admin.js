import express from 'express';
import {
    getNbOfUserCategory,
    getUsersByCateg,
    listNbrOfNotes,
    getNotesByTags,
} from '../controllers/handlers/admin.js';
const router = express.Router();
router.get('/notes/bycategory', getNbOfUserCategory);
router.get('/list/users', getUsersByCateg);
router.get('/list/notescreated', listNbrOfNotes);
router.get('/notes/by', getNotesByTags);
export default router;
