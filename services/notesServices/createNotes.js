import {
    checkFile,
    checkImage,
    getFileLocation,
    getImageLocation,
} from '../../utils/uploadHelpers.js';

export async function pushImageFile(image, file, __dirname, newNote) {
    //validate file and image type
    checkImage(image);
    checkFile(file);
    //initialize the location where the files and will be saved
    const imagelocation = getImageLocation(image, __dirname);
    const filelocation = getFileLocation(file, __dirname);
    //add image and file
    newNote.imageLocation.push(imagelocation);
    newNote.attachementLocation.push(filelocation);
    await newNote.save();
    //move files to this directory
    await file.mv(filelocation);
    await image.mv(imagelocation);
}
export async function pushFile(file, __dirname, newNote) {
    //allowed file types
    checkFile(file);
    //set file location in server
    const filelocation = getFileLocation(file, __dirname);
    //find this specific note and update this field
    newNote.attachementLocation.push(filelocation);
    await newNote.save();
    //move file to location
    await file.mv(filelocation);
}
export async function pushImage(image, __dirname, newNote) {
    //validate file and image type
    checkImage(image);
    //initialize the location where the files and will be saved
    const imagelocation = getImageLocation(image, __dirname);
    //add image to note model
    newNote.imageLocation.push(imagelocation);
    await newNote.save();
    //save innside uploads folder
    await image.mv(imagelocation);
}
