import express from 'express';
import { getAlbumDisplay, getCameraDisplay } from '../controllers/displayController.js';

const router = express.Router();

// get album display
router.get('/', getAlbumDisplay);
router.get('/camera', getCameraDisplay);

export default router;