import express from 'express';
import { getComments, addComment, removeComment } from '../controllers/commentsController.js'

const router = express.Router();

// GET all images
router.get('/', getComments);
router.post('/:imageId', addComment);
router.delete('/:id', removeComment);

export default router;
