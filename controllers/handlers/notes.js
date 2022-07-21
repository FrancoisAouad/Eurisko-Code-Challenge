import Notes from '../../models/notes.js';
import path from 'path';
import user from '../../models/user.js';
import { getUser } from '../../utils/getUser.js';
import { noteSchema } from '../../middleware/validation/notesValidation.js';

//CREATE NOTE

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
        const image = req?.files?.image;
        const file = req?.files?.file;
        //-------------No Image AND File------------------//
        if (image == (undefined || null) && file != (undefined || null)) {
            //allowed file types
            const fileExtension = path.extname(file.name);
            const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

            if (!allowedExtensionFile.includes(fileExtension)) {
                return res.status(422).send('Invalid File');
            }
            //assign name to file
            const fileName =
                new Date().getTime().toString() + path.extname(file.name);
            //set file location in server
            const filelocation = path.join(
                __dirname,
                'uploads',
                'files',
                'notes',
                fileName
            );

            //find this specific note and update this field
            const note = await Notes.create({
                attachementLocation: filelocation,
                creatorID: id,
                title: title,
                content: content,
                tags: tags,
                creatorEmail: UserInfo.email,
                creatorName: UserInfo.name,
                category: category,
                date: Date.now(),
            });

            //move file to location
            await file.mv(filelocation);
            return res.status(201).json({
                success: true,
                message: 'Note added!',
                data: note,
            });
        }
        //-------------Image AND No File------------------//
        if (image != (undefined || null) && file == (undefined || null)) {
            const imageExtension = path.extname(image.name);
            console.log(imageExtension);
            const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

            if (!allowedExtensionImage.includes(imageExtension)) {
                return res.status(422).send('Invalid Image');
            }
            const imageName =
                new Date().getTime().toString() + path.extname(image.name);

            const imagelocation = path.join(
                __dirname,
                'uploads',
                'img',
                'notes',
                imageName
            );
            const note = await Notes.create({
                imageLocation: imagelocation,
                title: title,
                content: content,
                creatorID: id,
                creatorEmail: UserInfo.email,
                creatorName: UserInfo.name,
                tags: tags,
                category: category,
                date: Date.now(),
            });
            console.log(note);

            return res.status(201).json({
                success: true,
                message: 'Note added!',
                data: note,
            });
        }
        //-------------Image AND File exists------------------//
        if (image != (undefined || null) && file != (undefined || null)) {
            //validate file and image type
            const fileExtension = path.extname(file.name);
            const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

            if (!allowedExtensionFile.includes(fileExtension)) {
                return res.status(422).send('Invalid File');
            }
            const imageExtension = path.extname(image.name);
            const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

            if (!allowedExtensionImage.includes(imageExtension)) {
                return res.status(422).send('Invalid Image');
            }
            //assign new names to files and images
            const imageName =
                new Date().getTime().toString() + path.extname(image.name);

            const fileName =
                new Date().getTime().toString() + path.extname(file.name);
            //initialize the location where the files and will be saved
            const imagelocation = path.join(
                __dirname,
                'uploads',
                'img',
                'notes',
                imageName
            );

            const filelocation = path.join(
                __dirname,
                'uploads',
                'files',
                'notes',
                fileName
            );
            // push newly added image to the array with tese fields
            const note = await Notes.create({
                imageLocation: imagelocation,
                attachementLocation: filelocation,
                title: title,
                content: content,
                creatorEmail: UserInfo.email,
                creatorName: UserInfo.name,
                creatorID: id,
                tags: tags,
                category: category,
                date: Date.now(),
            });

            //move files to this directory
            await file.mv(filelocation);
            await image.mv(imagelocation);

            return res.status(201).json({
                success: true,
                message: 'Note added!',
                data: note,
            });
        }
        //-------------No Image AND No File------------------//
        if (!(req.files && req.files.image) && !(req.files && req.files.file)) {
            const note = await Notes.create({
                title: title,
                content: content,
                tags: tags,
                creatorID: id,
                creatorEmail: UserInfo.email,
                creatorName: UserInfo.name,
                category: category,
                date: Date.now(),
            });

            return res.status(201).json({
                success: true,
                message: 'Note added!',
                data: note,
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
            $and: [
                { creatorID: { $eq: id } },
                { _id: { $eq: req.params.noteId } },
            ],
        }).populate({
            path: 'category',
            select: ['_id', 'categoryname'],
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
//GET ALL NOTES
export const getNotes = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        const notes = await Notes.find({
            creatorID: { $eq: id },
        })
            .sort({ date: -1 })
            .populate({
                path: 'category',
                select: ['_id', 'categoryName'],
            });
        if (!notes)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'Notes Not Found..',
            });

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });
    } catch (e) {
        next(e);
    }
};
//SEARCH BY CATEGORY
export const searchCategory = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        const note = await Notes.find({
            $and: [
                { creatorID: { $eq: id } },
                { category: { $eq: req.params.categoryId } },
            ],
        })
            .sort({ date: -1 })
            .populate({
                path: 'category',
                select: ['_id', 'categoryName'],
            });
        if (!note)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'No notes to be seen..',
            });
        res.status(200).json({
            success: true,
            count: note.length,
            data: note,
        });
    } catch (e) {
        next(e);
    }
};
// SEARCH BY TAG
export const searchTags = async (req, res, next) => {
    try {
        const { tag } = req.body;
        console.log(tag);

        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        const note = await Notes.find({
            $and: [{ creatorID: { $eq: id } }, { tags: { $all: tag } }],
        })
            .sort({ date: -1 })
            .populate({
                path: 'category',
                select: ['_id', 'categoryName'],
            });
        if (!note)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'No notes to be seen..',
            });

        return res
            .status(200)
            .json({ success: true, count: note.length, data: note });
    } catch (e) {
        next(e);
    }
};
//UPDATE NOTE
export const editNote = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        //check is note exists with creator id and noteid
        const exists = await Notes.find({
            $and: [
                { creatorID: { $eq: id } },
                { _id: { $eq: req.params.noteId } },
            ],
        });
        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Note not found..',
            });
        }
        const __dirname = path.resolve();
        const { title, content, tags, category } =
            await noteSchema.validateAsync(req.body);
        const image = req?.files?.image;
        const file = req?.files?.file;
        //-------------No Image AND File------------------//
        if (image == (undefined || null) && file != (undefined || null)) {
            //allowed file types
            const fileExtension = path.extname(file.name);
            const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

            if (!allowedExtensionFile.includes(fileExtension)) {
                return res.status(422).send('Invalid File');
            }
            //assign name to file
            const fileName =
                new Date().getTime().toString() + path.extname(file.name);
            //set file location in server
            const filelocation = path.join(
                __dirname,
                'uploads',
                'files',
                'notes',
                fileName
            );
            //find this specific note and update this field
            const note = await Notes.findOneAndUpdate(
                {
                    $and: [
                        { creatorID: { $eq: id } },
                        { _id: { $eq: req.params.noteId } },
                    ],
                },
                {
                    $push: { attachementLocation: filelocation },
                    $set: {
                        title: title,
                        content: content,
                        tags: tags,
                        category: category,
                        date: Date.now(),
                    },
                }
            );

            //move file to location
            await file.mv(filelocation);
            return res.status(200).json({
                success: true,
                message: 'Note Updated!',
                data: note,
            });
        }
        //-------------Image AND No File------------------//
        if (image != (undefined || null) && file == (undefined || null)) {
            const imageExtension = path.extname(image.name);
            console.log(imageExtension);
            const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

            if (!allowedExtensionImage.includes(imageExtension)) {
                return res.status(422).send('Invalid Image');
            }
            const imageName =
                new Date().getTime().toString() + path.extname(image.name);

            const imagelocation = path.join(
                __dirname,
                'uploads',
                'img',
                'notes',
                imageName
            );
            //note must have same creator id and object id
            const note = await Notes.findOneAndUpdate(
                {
                    $and: [
                        { creatorID: { $eq: id } },
                        { _id: { $eq: req.params.noteId } },
                    ],
                },
                {
                    $push: { imageLocation: imagelocation },
                    $set: {
                        title: title,
                        content: content,
                        tags: tags,
                        category: category,
                        date: Date.now(),
                    },
                }
            );
            console.log(note);

            return res.status(200).json({
                success: true,
                message: 'Note Updated!',
                data: note,
            });
        }
        //-------------Image AND File exists------------------//
        if (image != (undefined || null) && file != (undefined || null)) {
            //validate file and image type
            const fileExtension = path.extname(file.name);
            const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

            if (!allowedExtensionFile.includes(fileExtension)) {
                return res.status(422).send('Invalid File');
            }
            const imageExtension = path.extname(image.name);
            const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

            if (!allowedExtensionImage.includes(imageExtension)) {
                return res.status(422).send('Invalid Image');
            }
            //assign new names to files and images
            const imageName =
                new Date().getTime().toString() + path.extname(image.name);

            const fileName =
                new Date().getTime().toString() + path.extname(file.name);
            //initialize the location where the files and will be saved
            const imagelocation = path.join(
                __dirname,
                'uploads',
                'img',
                'notes',
                imageName
            );

            const filelocation = path.join(
                __dirname,
                'uploads',
                'files',
                'notes',
                fileName
            );
            // push newly added image to the array with tese fields
            const note = await Notes.findOneAndUpdate(
                {
                    $and: [
                        { creatorID: { $eq: id } },
                        { _id: { $eq: req.params.noteId } },
                    ],
                },
                {
                    $push: {
                        imageLocation: imagelocation,
                        attachementLocation: filelocation,
                    },
                    $set: {
                        title: title,
                        content: content,
                        tags: tags,
                        category: category,
                        date: Date.now(),
                    },
                }
            );

            //move files to this directory
            await file.mv(filelocation);
            await image.mv(imagelocation);

            return res.status(200).json({
                success: true,
                message: 'Note added!',
                data: note,
            });
        }
        //-------------No Image AND No File------------------//
        if (!(req.files && req.files.image) && !(req.files && req.files.file)) {
            const note = await Notes.findOneAndUpdate(
                {
                    $and: [
                        { creatorID: { $eq: id } },
                        { _id: { $eq: req.params.noteId } },
                    ],
                },
                {
                    $set: {
                        title: title,
                        content: content,
                        tags: tags,
                        category: category,
                        date: Date.now(),
                    },
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Note Updated!',
                data: note,
            });
        }
    } catch (e) {
        next(e);
    }
};
//DELETE NOTE
export const deleteNote = async (req, res, next) => {
    try {
        const note = await Notes.findByIdAndDelete(req.params.noteId);

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
