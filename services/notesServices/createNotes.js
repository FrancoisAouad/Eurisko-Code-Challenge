import Notes from '../../models/notes.js';
import path from 'path';
import tagModel from '../../models/tags.js';
import createError from 'http-errors';

export async function pushImageFile(image, file, __dirname, newNote) {
    //validate file and image type
    const fileExtension = path.extname(file.name);
    const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

    if (!allowedExtensionFile.includes(fileExtension)) {
        throw createError.UnprocessableEntity('Invalid File');
    }
    const imageExtension = path.extname(image.name);
    const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

    if (!allowedExtensionImage.includes(imageExtension)) {
        throw createError.UnprocessableEntity('Invalid Image');
    }
    //assign new names to files and images
    const imageName =
        new Date().getTime().toString() + path.extname(image.name);

    const fileName = new Date().getTime().toString() + path.extname(file.name);
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
    //add image and file
    newNote.imageLocation.push(imagelocation);
    newNote.filelocation.push(filelocation);
    await newNote.save();
    //move files to this directory
    await file.mv(filelocation);
    await image.mv(imagelocation);
}
export async function pushFile(file, __dirname, newNote) {
    //allowed file types
    const fileExtension = path.extname(file.name);
    const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

    if (!allowedExtensionFile.includes(fileExtension)) {
        throw createError.UnprocessableEntity('Invalid File');
    }
    //assign name to file
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    //set file location in server
    const filelocation = path.join(
        __dirname,
        'uploads',
        'files',
        'notes',
        fileName
    );
    //find this specific note and update this field
    newNote.filelocation.push(filelocation);
    await newNote.save();
    //move file to location
    await file.mv(filelocation);
}
export async function pushImage(image, __dirname, newNote) {
    //validate file and image type

    const imageExtension = path.extname(image.name);
    const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

    if (!allowedExtensionImage.includes(imageExtension)) {
        throw createError.UnprocessableEntity('Invalid Image');
    }
    //assign new names to files and images
    const imageName =
        new Date().getTime().toString() + path.extname(image.name);

    //initialize the location where the files and will be saved
    const imagelocation = path.join(
        __dirname,
        'uploads',
        'img',
        'notes',
        imageName
    );
    //add image to note model
    newNote.imageLocation.push(imagelocation);
    await newNote.save();
    //save innside uploads folder
    await image.mv(imagelocation);
}
export async function inserTags(tags, newNote, UserInfo) {
    if (!tags) return; //return if no tags added
    //get length of array of tags
    const tagsLength = parseInt(tags.length);
    //loop all the array elements
    for (var i = 0; i < tagsLength; i++) {
        //assign tag string body to name variable
        const name = tags[i];
        //check if tag exists
        const exists = await tagModel.findOne({ tagName: name });

        if (exists) {
            //push tagID to the notes tag array if it already exists
            await Notes.updateOne(
                {
                    creatorID: UserInfo._id,
                    _id: newNote._id,
                },
                { $push: { tags: exists._id } }
            );
            //push userID to creatorsID field inside tag
            await tagModel.updateOne(
                { _id: exists._id },
                { $addToSet: { creatorsID: UserInfo._id } }
            );
        } else if (!exists) {
            //create new tag for the tag
            const newTags = new tagModel({
                tagName: name,
            });
            //save tag
            let savedtag = await newTags.save();
            //push the newly created tagID to the note tags field
            await Notes.updateOne(
                {
                    creatorID: UserInfo._id,
                    _id: newNote._id,
                },
                { $push: { tags: savedtag._id } }
            );
            //add the userid to the names of the users that used this tag
            await tagModel.updateOne(
                { _id: savedtag._id },
                { $addToSet: { creatorsID: UserInfo._id } }
            );
        }
    }
}
