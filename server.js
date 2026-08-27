import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
//import { promises as fs} from 'fs'; // allows for async file reading
import cookieParser from 'cookie-parser';
import logger from './middleware/logger.mjs';
import session from 'express-session';
import images from './routes/images.js';
import comments from './routes/comments.js';
import display from './routes/display.js';
import authentication from './routes/authentication.js';

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

// cookie middleware - used in /verify route for authentication
app.use(cookieParser(process.env.COOKIE_KEY));

// session middleware
app.use(
  session({
    name: "session",    
    secret: process.env.SESSION_KEY, // change this to something long and random
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);


const port = process.env.PORT || 8080;

// parse json data
app.use(express.json());

// Select ejs middleware
app.set('view engine', 'ejs');

// middleware for routing to access the s3 bucket
// routes in this middlware regard creating, reading, updating, and deleting images.
app.use('/api/images', images);

app.use('/api/comments', comments);

// routes in this middlware regard general flow
app.use('/display', display);

// authentication
app.use('/verify', authentication);

// redirect this to make /display the default
app.get('/', (req, res) => {
  res.redirect('/display');
});

// initialize a port.
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
