import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getImageDataByUsername } from '../database/imageQueries.js';

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  },
});

export async function getImagesByUsernameService(username) {
  try {
    const rows = await getImageDataByUsername(username);

    const imageList = await Promise.all(
      rows.map(async (row) => {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
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

    return {
      length: imageList.length,
      images: imageList
    };

  } catch (e) {
    console.log("Error in getUserImagesByUsernameService: " + e);
    return { length: 0, images: [] };
  }
}