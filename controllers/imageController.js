
//import { getAllImages, postImage } from '../services/s3Client.js';
import {getAllImages } from '../services/s3getAllImages.js';
import { postImage } from '../services/s3postImage.js';
// get all images
export const getImages = async (req, res, next) => {
    console.log('getImages called in imageController!')
    try {
        // service call to s3 bucket
        const data = await getAllImages(); // returns -> {# of images:# , images:[url, url, url]}
        res.status(200).json(data); // pass only images to where function was called
    } catch (e) {
        return res
            .status(500)
            .json({ msg: `No data found.`});
    }
};

export const createImage = async (req, res, next) => {
    try {
        const imageBuffer = req.file;
        console.log(imageBuffer);
        postImage(imageBuffer);
    }
    catch (e) {
        return res
            .status(500)
            .json({ msg: `No data created.`});
    }
};





/*
// From last project:
//import {getItem, getAllItems, createItem, updateItem, deleteItem } from '../database/queries.js';

// get single post
export const getPost = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
        const posts = await getItem(id);
        res.status(200).json(posts);
    } catch (e) {
        return res
            .status(404)
            .json({ msg: `A post with id of ${id} was not found.` })
    }
};

// create single post
export const createPost = async (req, res, next) => {

    // breaks the json string of {id: title} to their own variables
    let id, title;

    for (const [key, value] of Object.entries(req.body)) {
        id = key;
        title = value;
    };

    const result = await createItem(title);
    res.status(201).json({ msg: `A post with a title of ${title} was created.` });

};

// update single post
export const updatePost = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const title = req.body.newTitle;

    const result = await updateItem(id, title);
    res.status(201).json({ msg: `A post was updated to a new title of, ${title}.` });
    
};

// delete a post
export const deletePost = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const result = await deleteItem(id);
    const affectedRowCount = result[0].affectedRows;
    console.log(affectedRowCount)

    if (affectedRowCount === 0) {
        return res
            .status(404)
            .json({ msg: `A post with id of ${id} was not found.` })
    } else {
        res.status(200).json({ msg: `A post with id of ${id} was deleted.` });
    }

};
*/