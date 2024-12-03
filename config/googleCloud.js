const { Storage } = require('@google-cloud/storage');
const googleCloudKey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  credentials: googleCloudKey
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

module.exports = { storage, bucket };

