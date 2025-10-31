import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


// pass a random integer value as an argument into the function
// function returns url to image
export async function getRandomLabel(randomValue) {
  const ACCESS_KEY = process.env.ACCESS_KEY;
  const SECRET_KEY = process.env.SECRET_KEY;
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const REGION = process.env.REGION;

  const s3Client = new S3Client({
      region: REGION,
      credentials: {
          accessKeyId: ACCESS_KEY,
          secretAccessKey: SECRET_KEY,
      }
  });

  const main = async () => {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'nutrition/' + randomValue.toString() + '_gator.jpg',
      });
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60, // The URL expires in 60 seconds
      });
      return { url };
    } catch (err) {
      return { err };
    }
  };

  const url = await main();
  return url
}



// function returns a list of image urls
export async function getDirectory() {
  const ACCESS_KEY = process.env.ACCESS_KEY;
  const SECRET_KEY = process.env.SECRET_KEY;
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const REGION = process.env.REGION;

  const s3Client = new S3Client({
      region: REGION,
      credentials: {
          accessKeyId: ACCESS_KEY,
          secretAccessKey: SECRET_KEY,
      }
  });

  const main = async () => {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: 'nutrition/' + randomValue.toString() + '_gator.jpg',
      });
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60, // The URL expires in 60 seconds
      });
      return { url };
    } catch (err) {
      return { err };
    }
  };

  const url = await main();
  return url
}
