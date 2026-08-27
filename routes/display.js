import express from 'express';
import { getAlbumDisplay, getProfilePage, getCameraDisplay, getCreatePage, getLoginPage } from '../controllers/displayController.js';

const router = express.Router();

// get album display
router.get('/', getAlbumDisplay);
router.get('/camera', getCameraDisplay);
router.get('/create', getCreatePage);
router.get('/login', getLoginPage);
router.get('/profile', getProfilePage);
router.get('/profile/:username', getProfilePage);

export default router;