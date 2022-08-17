import Notes from '../../models/notes.js';
import {
    checkImage,
    checkFile,
    getFileLocation,
    getImageLocation,
} from '../../utils/uploadHelpers.js';

//UPDATE NOTE
export async function updateImage(image, __dirname, noteId) {
    //check image ype
    checkImage(image);
    //initialize image location
    const imagelocation = getImageLocation(image, __dirname);
    //update notes by pushing image location to document
    await Notes.updateOne(
        {
            _id: noteId,
        },
        {
            $push: {
                imageLocation: imagelocation,
            },
        }
    );

    await image.mv(imagelocation);
}
export async function updateFile(file, __dirname, noteId) {
    //check file type
    checkFile(file);
    //initialize file location
    const filelocation = getFileLocation(file, __dirname);
    //update
    await Notes.updateOne(
        {
            _id: noteId,
        },
        {
            $push: { attachementLocation: filelocation },
        }
    );
    //move file to server
    await file.mv(filelocation);
}
export async function updateImageFile(image, file, __dirname, noteId) {
    //check file type
    checkFile(file);
    //initialise file location using getter
    const filelocation = getFileLocation(file, __dirname);
    //check image type
    checkImage(image);
    //check image location
    const imagelocation = getImageLocation(image, __dirname);
    //push new upload data into edited document
    await Notes.updateOne(
        {
            _id: noteId,
        },
        {
            $push: {
                imageLocation: imagelocation,
                attachementLocation: filelocation,
            },
        }
    );
    //move uploads to server
    await image.mv(imagelocation);
    await file.mv(filelocation);
}
