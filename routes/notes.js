import express from 'express';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT.js';
import { isEmailVerified } from '../middleware/secure/isUserVerified.js';
import {
    getNotes,
    searchCategory,
    getNoteById,
    deleteNote,
    editNote,
    searchTags,
    createNote,
} from '../controllers/handlers/notes.js';

import { isNotePermitted } from '../middleware/secure/isPermitted.js';

const router = express.Router();

//-----------------------NOTES-----------------------//

/*-------CREATE-------*/
router.post('/notes/add-Notes', verifyAccessToken, isEmailVerified, createNote);
/*-------READ-------*/
// router.get('/notes', verifyAccessToken, isEmailVerified, getAllNotes);
router.get('/notes/:noteId', verifyAccessToken, isEmailVerified, getNoteById);
router.get('/notes', verifyAccessToken, isEmailVerified, getNotes);
/*-------SEARCH & FILTER-------*/
router.get(
    '/notes/search-category/:categoryId',
    verifyAccessToken,
    isEmailVerified,
    searchCategory
);

router.post(
    '/notes/search-tags',
    verifyAccessToken,
    isEmailVerified,
    searchTags
);

/*-------UPDATE-------*/
router.patch(
    '/notes/edit-Note/:noteId',
    verifyAccessToken,
    isEmailVerified,
    isNotePermitted,
    editNote
);
/*-------DELETE-------*/
router.delete(
    '/notes/delete-Note/:noteId',
    verifyAccessToken,
    isEmailVerified,
    isNotePermitted,
    deleteNote
);

export default router;
