const AWS = require('aws-sdk');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');

const AWS_ACCESS_KEY_ID="AKIAVYV52FGTMFTC4LMY"
const  AWS_SECRET_ACCESS_KEY="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"
 const AWS_REGION="eu-north-1"
 const AWS_S3_BUCKET_NAME="skillhub-learningapp"

// AWS Configuration
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey:AWS_SECRET_ACCESS_KEY,
  region:AWS_REGION,
});

const s3 = new AWS.S3();

// Multer configuration for in-memory file storage
const upload = multer({ storage: multer.memoryStorage() });

// Utility function to generate a random file name
const randomFileName = () => crypto.randomBytes(32).toString('hex');

// Export the utilities
module.exports = {
  s3,
  upload,
  randomFileName,
  sharp, // Exporting sharp in case it's needed elsewhere
};
