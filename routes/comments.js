import express from 'express';
import { getComments, addComment } from '../controllers/commentsController.js'

const router = express.Router();

// GET all images
router.get('/', getComments);
router.post('/:imageId', addComment);

export default router;
