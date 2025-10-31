import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { promises as fs} from 'fs'; // allows for async file reading
//import cookieParser from 'cookie-parser';
import logger from './middleware/logger.mjs';

// Get the current filename and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')))

// Logger middleware
app.use(logger);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

const port = process.env.PORT || 8080;

// parse json data
app.use(express.json());

// Select ejs middleware
app.set('view engine', 'ejs');



app.get(['/', '/index'], (req, res) => {
    try {
        res.render('home.ejs');
    } catch (e) {
        console.log("Error: " + e);
    }
});

app.get(['/album'], (req, res) => {
    try {
        res.render('displayalbum.ejs');
    } catch (e) {
        console.log("Error: " + e);
    }
});

app.get(['/getImages'], async (req, res) => {
    try {




    } catch (e) {
        console.log("Error: " + e);
    }



})




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})