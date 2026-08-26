import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getImageData } from "../database/imageQueries.js";

// assigning environment variables
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
// create s3 client based off of environment variables
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
  },
});

// call function with no args.
// function returns object with .length with the number of images and .images with an array of images
// if error occurs, an empty array will be returned
export async function getAllImages(){
  try {

    console.log('fetching data from database...')
    const rows = await getImageData();

    const imageList = await Promise.all(
      rows.map(async (row) => {
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: row.s3_key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 1000 });

        return {
          id: row.id,
          url: url,
          username: row.username
        };
      })
    );

    console.log("--- Fetched Images ---");
    imageList.forEach((item) => {
      console.log(`${item.username}, ${item.url.substring(0, 15)}`);
    });
    console.log("----------------------");

    return {
      length: imageList.length,
      images: imageList
    };

  } catch (e) {
    console.log("Error in getAllImages: " + e);
    return { length: 0, images: [] };
  }



    /*
    // List all objects under 'nutrition/' prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "nutrition/",
    });

    const listResponse = await s3Client.send(listCommand);

    // this is reversed so the images are loaded from the most recent first
    const objects = (listResponse.Contents || [])
      .filter(item => item.Key !== "nutrition/") 
      .reverse();

    const selectedObjects = objects.slice(0);
    
    // listResponse.Contents is an array of objects in the prefix
    const urls = await Promise.all(
      selectedObjects.map(async (item) => {
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 1000 });
        return url;
      })
        
    );
  
    // logging number of images
    console.log(urls.length);

    // put image sources into data object
    const dataArray =
    {
      length: urls.length,
      images: urls
    };
    return dataArray;
  }
  catch (e) {
    console.log("Error: " + e);
    return [];
  }
    */
}