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

router.post('/notes/add-Notes', verifyAccessToken, isEmailVerified, createNote);

router.get('/notes/:noteId', verifyAccessToken, isEmailVerified, getNoteById);
router.get('/notes', verifyAccessToken, isEmailVerified, getNotes);

router.patch(
    '/notes/edit-Note/:noteId',
    verifyAccessToken,
    isEmailVerified,
    isNotePermitted,
    editNote
);

router.delete(
    '/notes/delete-Note/:noteId',
    verifyAccessToken,
    isEmailVerified,
    isNotePermitted,
    deleteNote
);

export default router;
