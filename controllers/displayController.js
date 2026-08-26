
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

export const getCreatePage = async (req, res, next) => {  
    // if already logged in, redirect back home 
    //if (req.session.userId) {
    //    return res.redirect("/");
    //} 
    try {
        const userId = req.session?.userId || req.session?.user?.id;
        if (userId) {
            return res.redirect('/display/');
        }

        res.status(200).sendFile(path.join(__dirname, '..', 'public', 'views', 'authentication-views', 'createAccount.html'));
    }
    catch (e) {
        // server error
        console.log("Error: ", e)
        res.status(500).json({ error : e.message || 'Internal server error' });
    }
};

export const getLoginPage = async (req, res, next) => {
    // if already logged in, redirect back home 
    //if (req.session.userId) {
    //    return res.redirect("/");
    //} 
    try {
        const userId = req.session?.userId || req.session?.user?.id;

    if (userId) {
        return res.redirect('/display/');
    }

        res.status(200).sendFile(path.join(__dirname, '..', 'public', 'views', 'authentication-views', 'login.html'));
    }
    catch (e) {
        // server error
        console.log("Error: ", e)
        res.status(500).json({ error : e.message || 'Internal server error' });
    }
};

export const getProfilePage = async (req, res, next) => {

    try {
        const userId = req.session?.userId || req.session?.user?.id;
        if (!userId) {
            return res.redirect('/display/login');
        }

        res.status(200).sendFile(path.join(__dirname, '..', 'public', 'views', 'profile.html'));
    }
    catch (e) {
        // server error
        console.log("Error: ", e)
        res.status(500).json({ error : e.message || 'Internal server error' });
    }
};