import User from '../../models/user.js';
import Notes from '../../models/notes.js';
import Category from '../../models/category.js';
import { getUser } from '../../utils/getUser.js';

export const isCategoryPermitted = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        //check if user exists
        const user = await User.findOne({ _id: id });
        if (!user) return res.status(404);
        const catID = req.params.categoryId;

        // categories that have the sam
        const category = await Category.findOne({
            creatorID: id,
            _id: catID,
        });
        //send error when category return null
        if (!category)
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'No such category found..',
            });

        //param id diff than the category id
        if (category._id != catID) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'No',
            });
        }
        //loggedin user id diff than the one of the creator
        if (category.creatorID != id) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'No',
            });
        }
        next();
    } catch (e) {
        next(e);
    }
};
export const isNotePermitted = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        //check if user exists
        const user = await User.findOne({ _id: id });
        if (!user)
            return res.status(405).json({ success: false, message: 'yo' });
        const noteID = req.params.noteId;

        // categories that have the sam
        const note = await Notes.findOne({
            creatorID: id,
            _id: noteID,
        });
        //send error when note return null
        if (!note)
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'No such Note exists..',
            });

        //param id diff than the note id
        if (note._id != noteID) {
            return res.status(403).json({
                success: false,
                error: 'Forbbiden',
                message: 'Unauthorized Access.',
            });
        }
        //loggedin user id diff than the one of the creator
        if (note.creatorID != id) {
            return res.status(403).json({
                success: false,
                error: 'Forbbiden',
                message: 'Unauthorized Access.',
            });
        }
        next();
    } catch (e) {
        next(e);
    }
};
