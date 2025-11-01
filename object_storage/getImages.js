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

const getAllNutritionUrls = async () => {
  try {
    // List all objects under 'nutrition/' prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "nutrition/",
    });

    const listResponse = await s3Client.send(listCommand);

    const objects = listResponse.Contents || [];
    
    // Slice the array to get the desired range
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
    console.log(urls.length);
    return urls;
  } catch (err) {
    console.error("Error listing objects:", err);
    return [];
  }
};

getAllNutritionUrls().then(urls => console.log(urls));
