import express from 'express';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT.js';
import { isEmailVerified } from '../middleware/secure/isUserVerified.js';
import {
    getNotes,
    getNoteById,
    deleteNote,
    editNote,
    createNote,
} from '../controllers/handlers/notes.js';
import { isNotePermitted } from '../middleware/secure/isPermitted.js';

const router = express.Router();
const path = 'notes';

router.post(`/${path}`, verifyAccessToken, isEmailVerified, createNote);
router.get(`/${path}/:noteId`, verifyAccessToken, isEmailVerified, getNoteById);
router.get(`/${path}`, verifyAccessToken, isEmailVerified, getNotes);
router.patch(
    `/${path}/:noteId`,
    verifyAccessToken,
    isEmailVerified,
    isNotePermitted,
    editNote
);
router.delete(
    `/${path}/:noteId`,
    verifyAccessToken,
    isEmailVerified,
    isNotePermitted,
    deleteNote
);

export default router;
