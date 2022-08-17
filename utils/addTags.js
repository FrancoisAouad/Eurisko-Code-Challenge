import Notes from '../models/notes.js';
import tagModel from '../models/tags.js';

export async function addTags(tags, newNote, UserInfo) {
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
