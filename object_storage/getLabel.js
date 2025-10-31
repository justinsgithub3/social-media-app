import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


// pass a random integer value as an argument into the function
// function returns url to image
export async function getRandomLabel(randomValue) {
  const ACCESS_KEY = 'AKIAWOAVSWMF5LAHBRW3';
  const SECRET_KEY = '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';
  const BUCKET_NAME = 'test-nutrition-bucket-01';
  const REGION = 'us-east-1';

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

