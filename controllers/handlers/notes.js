import Notes from '../../models/notes.js';
import path from 'path';
import user from '../../models/user.js';
import categories from '../../models/category.js';
import tagModel from '../../models/tags.js';
import { getUser } from '../../utils/getUser.js';
import { noteSchema } from '../../middleware/validation/notesValidation.js';
import {
    pushFile,
    pushImage,
    pushImageFile,
} from '../../services/notesServices/createNotes.js';
import { addTags } from '../../utils/addTags.js';

export const createNote = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        //check is note exists with creator id and noteid
        const UserInfo = await user.findOne({ _id: id });
        const __dirname = path.resolve();
        //validate input
        const { title, content, tags, category } =
            await noteSchema.validateAsync(req.body);
        const cat = await categories.findOne({
            categoryName: category,
            creatorID: id,
        });
        if (!cat)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'no such category found..',
            });
        const newNote = await Notes.create({
            creatorID: id,
            title: title,
            content: content,
            categoryID: cat._id,
            creatorEmail: UserInfo.email,
            creatorName: UserInfo.name,
        });

        //call helper function to add tags and create documents
        addTags(tags, newNote, UserInfo);
        //initialize image and file chaining operators
        const image = req?.files?.image;
        const file = req?.files?.file;

        /* ADDITIONAL CONDITIONS OF WHEN USER INSERTS FILES AND IMAGES */
        if (image == (undefined || null) && file != (undefined || null)) {
            pushFile(file, __dirname, newNote);
            return res.status(201).json({
                success: true,
                message: 'Note added!',
            });
        }
        if (image != (undefined || null) && file == (undefined || null)) {
            pushImage(image, __dirname, newNote);

            return res.status(201).json({
                success: true,
                message: 'Note added!',
            });
        }
        if (image != (undefined || null) && file != (undefined || null)) {
            pushImageFile(image, file, __dirname, newNote);
            return res.status(201).json({
                success: true,
                message: 'Note added!',
            });
        }
        if (!(req.files && req.files.image) && !(req.files && req.files.file)) {
            return res.status(201).json({
                success: true,
                message: 'Note added!',
                note: newNote,
            });
        }
    } catch (e) {
        next(e);
    }
};
export const getNotes = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        let sort = req.query.Sort;
        //check if category exists
        const categ = await categories.find({ creatorID: id });
        //send error if it desnt exist
        if (!categ) {
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'No such Category found..',
            });
        }
        //set sort order
        let sortOrder = -1;
        // sort == 'ASC' ? (sortOrder = 11) : (sortOrder = 1);
        if (sort == 'ASC') {
            sortOrder = 1;
        }
        //pagination config
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        //default params object
        let params = { creatorID: id };
        //tags and category
        let tags = req.body.tags;
        const category = req.query.category;
        //first conditional match for tags
        if (tags) {
            //embedd tags field inside params object
            params.tags = [];
            //loop within the tags array
            for (let i = 0; i < tags.length; i++) {
                //save name of each input string
                const name = tags[i];
                //check if they exist inside the tag collection
                const tagexists = await tagModel.findOne({
                    tagName: name,
                    creatorsID: { $in: id },
                });
                // push the id of the current tag inside the tags embedded document array
                if (tagexists) {
                    params['tags'].push(tagexists._id);
                } else if (!tagexists) {
                    //send error if tag doesnt exist
                    return res.json({
                        message: `${name} doesnt exist on any note..`,
                    });
                }
            }
        }
        //second conditional match for category
        if (category) {
            //add category field params object
            params.category = category;
        }
        //get the total number of notes this user created
        const totalNotes = await Notes.find({ creatorID: id }).count();
        //query the database
        const notes = await Notes.find(params)
            .sort({ updatedDate: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);
        //send response
        const Total = totalNotes / page;
        return res.status(200).json({
            success: true,
            TotalRecords: totalNotes,
            Limit: limit,
            TotalPages: Total,
            Note: notes,
            Page: page,
        });
    } catch (e) {
        next(e);
    }
};
//GET SINGLE NOTE
export const getNoteById = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        const note = await Notes.find({
            creatorID: id,
            _id: req.params.noteId,
        });
        if (!note)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'Note Not Found..',
            });
        res.status(200).json({
            success: true,
            data: note,
        });
    } catch (e) {
        next(e);
    }
};
//UPDATE NOTE
export const editNote = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        const noteId = req.params.noteId;
        //check is note exists with creator id and noteid
        const exists = await Notes.find({
            creatorID: ID,
            _id: req.params.noteId,
        });
        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Note not found..',
            });
        }
        //set dirname variable
        const __dirname = path.resolve();
        //validate user input
        const { title, content, tags, category } =
            await noteSchema.validateAsync(req.body);
        //update note with new input
        await Notes.updateOne(
            {
                _id: req.params.noteId,
            },
            {
                $set: {
                    title: title,
                    content: content,
                    tags: tags,
                    category: category,
                    updatedDate: Date.now(),
                },
            }
        );

        //set file and image variable by using chainning
        const image = req?.files?.image;
        const file = req?.files?.file;
        //-------------No Image AND File------------------//
        if (image == (undefined || null) && file != (undefined || null)) {
            updateFile(file, __dirname, noteId);
            return res.status(200).json({
                success: true,
                message: 'Note Updated!',
            });
        }
        //-------------Image AND No File------------------//
        if (image != (undefined || null) && file == (undefined || null)) {
            updateImage(image, __dirname, noteId);
            return res.status(200).json({
                success: true,
                message: 'Note Updated!',
            });
        }
        //-------------Image AND File exists------------------//
        if (image != (undefined || null) && file != (undefined || null)) {
            updateImageFile(image, file, __dirname, noteId);

            return res.status(200).json({
                success: true,
                message: 'Note updated!',
            });
        }
        //-------------No Image AND No File------------------//
        if (!(req.files && req.files.image) && !(req.files && req.files.file)) {
            return res.status(200).json({
                success: true,
                message: 'Note Updated!',
            });
        }
    } catch (e) {
        next(e);
    }
};
//DELETE NOTE
export const deleteNote = async (req, res, next) => {
    try {
        const note = await Notes.deleteOne(req.params.noteId);
        res.status(201).json({
            success: true,
            message: 'Note Deleted!',
            data: note,
        });
        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Note not found..',
            });
        }
    } catch (e) {
        next(e);
    }
};
