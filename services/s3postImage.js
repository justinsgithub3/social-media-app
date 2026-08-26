import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { putImage } from "../database/imageQueries.js";

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

// imageBuf is a buffer of the image
export async function postImage(imageBuf, userId) {
  // create unique id with date time and math
  const uniqueId = Date.now() + Math.random().toString(36);
  const imageKey = `nutrition/${uniqueId}_image.PNG`;
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `nutrition/${uniqueId}_image.PNG`,
      Body: imageBuf.buffer,
      ContentType: 'image/png'
    }));

    await putImage(userId, imageKey);

  } 
  catch (e) {
    console.log("Error: " + e);
  }
}