import Notes from '../../models/notes.js';
import path from 'path';
import user from '../../models/user.js';
import categories from '../../models/category.js';
import { getUser } from '../../utils/getUser.js';
import { noteSchema } from '../../middleware/validation/notesValidation.js';

//GET NOTES+FILTER+SEARCH+SORT
export const getNotes = async (req, res, next) => {
    try {
        //get logged in user
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);
        //initialize values from query string.
        //size default val is 10 if not chosen, and page is 1
        const size = req.query.size || 10;
        const page = req.query.page || 1;
        const category = req.query.category;
        let tags = req.body.tags;
        let sort = req.query.Sort;
        //assig ndefault values to sortOrder and params object
        let params = { creatorID: id };
        let sortOrder = -1;
        //check if category exists
        const categ = await categories.find({ creatorID: id });

        if (!categ) {
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'No such Category found..',
            });
        }
        //set sorting to -1 if ASC in query string, and 1 if DSC
        sort == 'ASC' ? (sortOrder = -1) : (sortOrder = 1);
        //set params object depending on inserted values in the body and url
        //tags  AND NO CATEGORY
        if (tags && !category) {
            params = {
                $and: [{ creatorID: id }, { tags: { $all: tags } }],
            };
        }
        //TAGS AND CATEGORY
        if (tags && category) {
            params = {
                $and: [
                    { creatorID: id },
                    { category: category },
                    { tags: { $all: tags } },
                ],
            };
        }
        //category AND NO TAGS
        if (category && !tags) {
            params = {
                $and: [{ creatorID: id }, { category: category }],
            };
        }
        //fetch notes
        const notes = await Notes.find(params)
            .sort({ updatedDate: sortOrder })
            .skip((page - 1) * size)
            .limit(size);
        // const countNotes = await Notes.find(params).countDocuments();
        return res.status(200).json({ count: notes.length, Note: notes });
    } catch (e) {
        next(e);
    }
};
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
                updatedDate: Date.now(),
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
                updatedDate: Date.now(),
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
                updatedDate: Date.now(),
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
                updatedDate: Date.now(),
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
            $and: [{ creatorID: id }, { _id: req.params.noteId }],
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
//UPDATE NOTE
export const editNote = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const id = getUser(authHeader);

        //check is note exists with creator id and noteid
        const exists = await Notes.find({
            $and: [{ creatorID: id }, { _id: req.params.noteId }],
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

            const note = await Notes.updateOne(
                {
                    $and: [{ creatorID: id }, { _id: req.params.noteId }],
                },
                {
                    $push: { attachementLocation: filelocation },
                    $set: {
                        title: title,
                        content: content,
                        tags: tags,
                        category: category,
                        updatedDate: Date.now(),
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
            const note = await Notes.updateOne(
                {
                    $and: [{ creatorID: id }, { _id: req.params.noteId }],
                },
                {
                    $push: { imageLocation: imagelocation },
                    $set: {
                        title: title,
                        content: content,
                        tags: tags,
                        category: category,
                        updatedDate: Date.now(),
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
            const note = await Notes.updateOne(
                {
                    $and: [{ creatorID: id }, { _id: req.params.noteId }],
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
                        updatedDate: Date.now(),
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
            const note = await Notes.updateOne(
                {
                    $and: [{ creatorID: id }, { _id: req.params.noteId }],
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
