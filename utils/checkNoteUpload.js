import path from 'path';
import createError from 'http-errors';
//function to check allowed image type
export function checkImage(image) {
    const imageExtension = path.extname(image.name);
    const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

    if (!allowedExtensionImage.includes(imageExtension)) {
        throw createError.UnprocessableEntity('Invalid Image');
    }
}
//function to check allowed file type
export function checkFile(file) {
    const fileExtension = path.extname(file.name);
    const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

    if (!allowedExtensionFile.includes(fileExtension)) {
        throw createError.UnprocessableEntity('Invalid File');
    }
}
//reusable function to check image
// export function checkImageFile(image, file) {
//     const imageExtension = path.extname(image.name);
//     const allowedExtensionImage = ['.png', '.jpg', '.jpeg'];

//     if (!allowedExtensionImage.includes(imageExtension)) {
//         throw createError.UnprocessableEntity('Invalid Image');
//     }
//     const fileExtension = path.extname(file.name);
//     const allowedExtensionFile = ['.pdf', '.txt', '.docx'];

//     if (!allowedExtensionFile.includes(fileExtension)) {
//         throw createError.UnprocessableEntity('Invalid File');
//     }
// }
