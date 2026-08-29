
//import { getAllImages, postImage } from '../services/s3Client.js';
import { getAllImages } from '../services/s3getAllImages.js';
import { postImage } from '../services/s3postImage.js';
import { getUserImagesService } from '../services/getUserImages.js';
import { getImagesByUsernameService } from '../services/getImagesByUsername.js';
// get all images
export const getImages = async (req, res, next) => {
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

export const getUserImages = async (req, res, next) => {
    try {
        const userId = req.session?.userId || req.session?.user?.id;

        if (!userId) {
            return res.status(401).json({ msg: "Unauthorized. Please log in." });
        }

        const data = await getUserImagesService(userId);
        
        return res.status(200).json(data);

    } catch (e) {
        console.error("Error in getUserImages controller:", e);
        return res.status(500).json({ msg: "Failed to retrieve user images." });
    }
}

export const getImagesByUsername = async (req, res, next) => {
    try {
        const { username } = req.params; // Or req.query.user depending on route setup

        if (!username) {
            return res.status(400).json({ msg: "Username is required." });
        }

        // Pass the target username (instead of session userId) to your service
        const data = await getImagesByUsernameService(username); 
        
        return res.status(200).json(data);

    } catch (e) {
        console.error("Error in getImagesByUsername controller:", e);
        return res.status(500).json({ msg: "Failed to retrieve user images." });
    }   

}

export const createImage = async (req, res, next) => {
    try {

        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Please log in." });
        }

        const imageBuffer = req.file;

        await postImage(imageBuffer, userId);

        return 
            res.redirect('/display');
    }
    catch (e) {
        return res
            .status(500)
            .json({ msg: `No data created.`});
    } finally { // testing: 
        // after posting image automatically redirect to album 
        res.redirect('/display');
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