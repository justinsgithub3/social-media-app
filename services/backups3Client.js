import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;


const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
  },
});
// (first, last) arguments are slice positions for which images to fetch from s3 bucket
// if a second argument is left out then the entire list of urls will be provided
const getAllNutritionUrls = async (first, last='full array') => {
  try {
    // List all objects under 'nutrition/' prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "nutrition/",
    });

    const listResponse = await s3Client.send(listCommand);

    const objects = listResponse.Contents || [];
    


    let selectedObjects;
    // Slice the array to get the desired range
    if (last == 'full array') {
        selectedObjects = objects.slice(0);
    } else {
        selectedObjects = objects.slice(first, last);
    }

    // listResponse.Contents is an array of objects in the prefix
    const urls = await Promise.all(
      selectedObjects.map(async (item) => {
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        return url;
      })
    );
    console.log(urls.length);
    return urls;
  } catch (err) {
    console.error("Error listing objects:", err);
    return [];
  }
};




getAllNutritionUrls(1).then(urls => console.log(urls));




// imports
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();



// if user wants an 
// get single image
export async function getItem(id){
    const res = await pool.query("SELECT category_id, category_name " +
                                 "FROM test_table_2 " +
                                 "WHERE category_id = ?", id);
    return res;
}


// get all items
export async function getAllItems(){
    const res = await pool.query("SELECT * FROM test_table_2");
    return res;
}




// new real file here****
// imports
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

export async function getImage(id){
  // once we identify images with an id we can use this function
}

export async function getAllImages(){
  try {
    // List all objects under 'nutrition/' prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "nutrition/",
    });

    const listResponse = await s3Client.send(listCommand);

    const objects = listResponse.Contents || [];

    const selectedObjects = objects.slice(0);
    
    // listResponse.Contents is an array of objects in the prefix
    const urls = await Promise.all(
      selectedObjects.map(async (item) => {
        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
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
}


