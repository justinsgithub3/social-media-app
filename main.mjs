import { Album, Image } from './classtore.mjs';
import { imageFormatter } from './imageformatter.mjs';
import express from 'express';
import multer from 'multer';
import fs from 'fs';                 // automatically isntalled with node?
//will this be here?
import { fileURLToPath } from 'url';
import path from 'path'

// Get the current filename and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the express application
const app = express();

app.use(express.static(path.join(__dirname, 'public')));


//middleware to parse json request body
app.use(express.json({limit:'50mb'})); 

const port = process.env.PORT || 8080;

// Select ejs middleware
app.set('view engine', 'ejs');

// Select the middleware to decode incoming posts
app.use(express.urlencoded({ extended: false }));

// Configure multer to store uploaded files in a specific directory
const storage = multer.diskStorage({
  destination: './public/images/',                                        //editeedd*****
  filename: (req, file, cb) => {
  //return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    const extname = path.extname(file.originalname);
    console.log('Extension: ' + extname);
    // convert .heic to .png
    if  (extname.toLowerCase() === '.heic' ||
         extname.toLowerCase() === '.heif') {
        }
    const fileName = `${file.fieldname}_${Date.now()}${extname}`;
    return cb(null, fileName);
  }});

  const upload = multer({ storage: storage });

// create an album
let album = new Album(100);

// Home page
app.get(['/','/index'], (request, response) => {
    response.render('home.ejs')
  });

app.get('/camera', (request, response) => {
    response.render('ioscamera.ejs');
});

app.post('/upload', upload.single('form-image'), (request, response) => {

  try {
    if (request.file) {
      console.log(`Uploaded image: ${request.file.filename}`);
      // Handle successful upload (e.g., create image URL)
      const extname = path.extname(request.file.originalname);
      if  (extname.toLowerCase() === '.heic' ||
           extname.toLowerCase() === '.heif') {
        console.log("We GOt a Wild One!!");
        imageFormatter(request.file);
     }
    } else {
      console.log("No image uploaded");
    }
  } catch (err) {
    console.error(err);
    console.log("Error uploading file");
  }
});

app.get('/album', (request, response) => {

  const imagesDir = path.join(__dirname, 'public/images');      //edited*******
  fs.readdir(imagesDir, (err, files) => {
      if (err) {
          return console.log('Unable to read the images directory');
      }
      // Filter the files to include only image files
      const photos = files.filter(file => ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.tiff', '.ico'].includes(path.extname(file).toLowerCase()));

      response.render('iosdisplayalbum.ejs', {photos});
  });
});

// listen for request on port 8080
app.listen(port, () => {
console.log("Server running");
})