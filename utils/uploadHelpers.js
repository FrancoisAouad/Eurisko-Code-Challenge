import path from 'path';
import createError from 'http-errors';
//FUNCTION TO CHECK ALLOWED IMAGE TYPE
export function checkImage(image) {
    const imageExtension = path.extname(image.name);
    const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];
    //throw error if image is not of the following type
    if (!allowedExtensionImage.includes(imageExtension)) {
        throw createError.UnprocessableEntity('Invalid Image');
    }
}
//FUNCTION TO CHECK ALLOWED FILE TYPE
export function checkFile(file) {
    const fileExtension = path.extname(file.name);
    const allowedExtensionFile = ['.pdf', '.txt', '.docx'];
    //throw error if file is not of the following type
    if (!allowedExtensionFile.includes(fileExtension)) {
        throw createError.UnprocessableEntity('Invalid File');
    }
}
//FUNCTION TO GET FILE LOCATION
export function getFileLocation(file, __dirname) {
    //set filename
    const fileName = new Date().getTime().toString() + path.extname(file.name);
    //set file location in server
    const filelocation = path
        .join(__dirname, 'uploads', 'files', 'notes', fileName)
        .toString();
    //return the file location string
    return filelocation;
}
//FUNCTION TO GET IMAGE LOCATION
export function getImageLocation(image, __dirname) {
    //set image name
    const imageName =
        new Date().getTime().toString() + path.extname(image.name);
    //set image location
    const imagelocation = path
        .join(__dirname, 'uploads', 'img', 'notes', imageName)
        .toString();
    //return the image location string
    return imagelocation;
}
