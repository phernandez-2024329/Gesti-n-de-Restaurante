import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dsxadnzb5',
  api_key: '258132534261792',
  api_secret: 'h39jOq6yxclzsgtfAaT_9724W4g'
});

export const uploadToCloudinary = async (filePath, folder = 'auth_service/profiles') => {
  return await cloudinary.uploader.upload(filePath, { folder });
};
