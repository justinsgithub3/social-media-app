import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
//import { promises as fs} from 'fs'; // allows for async file reading
//import cookieParser from 'cookie-parser';
import logger from './middleware/logger.mjs';
import images from './routes/images.js';
import displays from './routes/displays.js';

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

// middleware for routing to access the s3 bucket
// routes in this middlware regard creating, reading, updating, and deleting images.
app.use('/api/images', images);

// routes in this middlware regard general flow
app.use('/displays', displays);

// redirect this to make /displays the default
app.get('/', (req, res) => {
  res.redirect('/displays');
});

// initialize a port.
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})