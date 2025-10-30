import { promises as fs } from 'fs';

import { fileURLToPath } from 'url';
import path from 'path'

// Get the current filename and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HEIC conversion
import heicconvert from 'heic-convert';


export async function imageFormatter(file) { //request.file
    console.log(`We have ${file.filename} in the imageFormatter function`);

    try {
        const inputBuffer = await fs.readFile(file.path);
        const outputBuffer = await heicconvert({
            buffer: inputBuffer, // the HEIC file buffer
            format: "PNG", // output format
            quality: 0.9, // the png compression quality, between 0 and 1
        });
    
        const newFilename = `${file.filename.split('.')[0]}.png`;
        const outputPath = path.join(path.dirname(file.path), newFilename);

        await fs.writeFile(outputPath, outputBuffer);

        await fs.unlink(file.path);

        console.log("done");
    } catch (error) {
        console.log(error);
    };
}


export async function convertHEICtoPNG(file) {
    if (!file.name.toLowerCase().endsWith('.heic') &&
        !file.name.toLowerCase().endsWith('.heif')) {
        return file;
    };
    try {
        const bitMap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = bitMap.width;
        canvas.height = bitMap.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitMap, 0, 0);

        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 0.9)
        });
       
        return new File([blob], file.name.replace(/\.[^.]+$/, '.png'), 
        {
            type: 'image/png',
            lastModified: Date.now()
        });
    } catch (error) {
        console.error('Conversion Failed: ', error);
        return file;
    }
}