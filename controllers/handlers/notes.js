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
import {
    updateFile,
    updateImage,
    updateImageFile,
} from '../../services/notesServices/editNotes.js';
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
            creatorID: id,
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

export const getNotes = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        let sort = req.query.Sort;
        //get objectId of user
        const loguser = await user.findOne({ _id: id });
        let sortOrder = -1;
        if (sort == 'ASC') {
            sortOrder = 1;
        }
        //pagination config
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        //defaulr param object if no filtering and searching input sent
        let params = [{ $match: { creatorID: loguser._id } }];
        //general aggregation stages for all cases
        let skipObj = {
            $skip: (page - 1) * limit,
        };
        let limitObj = {
            $limit: limit,
        };
        let sortObj = {
            $sort: { updatedDate: -1 },
        };
        //user inputs tags
        if (req.body.tags) {
            //save body inside tags array
            let tags = req.body.tags;
            //set empty tags array that will store tags objectID
            let tagsArray = [];
            for (let i = 0; i < tags.length; i++) {
                const name = tags[i];
                const tagexists = await tagModel.findOne({
                    tagName: name,
                    creatorsID: { $in: id },
                });

                if (tagexists) {
                    //push id if tags exist
                    tagsArray.push(tagexists._id);
                } else if (!tagexists) {
                    return res.json({
                        message: `${name} doesnt exist on any note..`,
                    });
                }
            }
            //stage that matches all user notes with these categories
            let tagsObjMatch = {
                $match: { tags: { $in: tagsArray } },
            };
            //stage that will join tags collection to notes
            let tagsObjLookup = {
                $lookup: {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags',
                },
            };
            //final stage that will project info needed for client side
            let tagsProjectObj = {
                $project: {
                    _id: 0,
                    noteID: '$_id',
                    title: 1,
                    content: 1,
                    tags: '$tags.tagName',
                    imaage: '$imageLocation',
                    attachement: '$attachementLocation',
                    created: '$createdDate',
                    updated: '$updatedDate',
                },
            };
            //push all object into the params array as aggregation stages
            params.push(
                tagsObjMatch,
                tagsObjLookup,
                skipObj,
                limitObj,
                sortObj,
                tagsProjectObj
            );
        }
        //user inputs category
        if (req.query.category) {
            //save category id inside variable for query
            const category = req.query.category;
            //find this specific document
            const categ = await categories.findOne({
                creatorID: id,
                _id: category,
            });

            if (!categ) {
                return res.status(404).json({
                    success: false,
                    error: 'NotFound',
                    message: 'No such Category found..',
                });
            }
            //stage that checks all documents with this categoryid
            let ObjCategory = { $match: { categoryID: categ._id } };
            //joins tags to notes
            let categoryObjLookupTags = {
                $lookup: {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags',
                },
            };
            //joins category to notes
            let categoryLookup = {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'categoryID',
                },
            };
            //project needed info to frontend
            let projectCategories = {
                $project: {
                    _id: 0,
                    noteID: '$_id',
                    title: 1,
                    content: 1,
                    category: { $arrayElemAt: ['$categoryID.categoryName', 0] },
                    tags: '$tags.tagName',
                    images: '$imageLocation',
                    attachement: '$attachementLocation',
                    created: '$createdDate',
                    updated: '$updatedDate',
                },
            };
            //push aggregation stages to params
            params.push(
                ObjCategory,
                categoryObjLookupTags,
                categoryLookup,
                skipObj,
                limitObj,
                sortObj,
                projectCategories
            );
        }
        //get total number of notes
        const totalNotes = await Notes.find({ creatorID: id }).count();
        //aggregation
        const notes = await Notes.aggregate(params);
        //data response
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
