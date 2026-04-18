import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dd0wrsq1g',
  api_key: '834313277273255',
  api_secret: '7ndc4Bo2S0OeEVMKUV9Y1Q0M7GQ'
});

export const uploadToCloudinary = async (filePath, folder = 'auth_service/profiles') => {
  return await cloudinary.uploader.upload(filePath, { folder });
};
