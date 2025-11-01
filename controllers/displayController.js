
import path from 'path';
import { fileURLToPath } from 'url'; 
// Get the current filename and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get all images
export const getAlbumDisplay = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '..', 'public', 'views', 'album.html'));

    } catch (e) {
        return res
            .status(500)
            .json({ msg: `No album page found...`});
    }
};
export const getCameraDisplay = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, '..', 'public', 'views', 'camera.html'));
    } catch (e) {
        return res
            .status(500)
            .json({ msg: `No album page found...`});
    }
};
