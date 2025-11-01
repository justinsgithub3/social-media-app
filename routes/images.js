import express from 'express';
import { getImages } from '../controllers/imageController.js'

const router = express.Router();

// GET all images
router.get('/', getImages);

export default router;




// from last project:
//import {getPosts, getPost, createPost, updatePost, deletePost, getLabel} from '../controllers/Controller.js';
// Get all posts
//router.get('/', getLabel);
// Get single post
//router.get('/:id', getPost);
// Create new post
//router.post('/', createPost);
// Update post
//router.put('/:id', updatePost);
// Delete post
//router.delete('/:id', deletePost);