import express from 'express';
import { getImages, getUserImages, createImage } from '../controllers/imageController.js'
import multer from 'multer';

// Choose storage type
const storage = multer.memoryStorage(); // keeps image in memory as Buffer
const upload = multer({ storage });

const router = express.Router();

// GET all images
router.get('/', getImages);
router.get('/user-images', getUserImages);

// POST new image to s3 bucket
router.post('/', upload.single('form-image'), createImage);

export default router;
