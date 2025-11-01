import express from 'express';
import { getImages, createImage } from '../controllers/imageController.js'
import multer from 'multer';

// Choose storage type
const storage = multer.memoryStorage(); // keeps image in memory as Buffer
const upload = multer({ storage });

const router = express.Router();

// GET all images
router.get('/', getImages);

// POST new image to s3 bucket
router.post('/', upload.single('form-image'), createImage);

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