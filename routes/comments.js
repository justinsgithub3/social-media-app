import express from 'express';
import { getComments } from '../controllers/commentsController.js'

const router = express.Router();

// GET all images
router.get('/', getComments);

export default router;
