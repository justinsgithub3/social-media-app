import express from 'express';
import { getAlbumDisplay } from '../controllers/displayController.js';

const router = express.Router();

// get album display
router.get('/album', getAlbumDisplay);

export default router;