const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Single Image
const uploadSingleImage = (file, folder = "categories") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder},
            (error, result) => {
                if (result) resolve(
                    {
                        url: result.secure_url,
                        public_id: result.public_id,
                    }
                );
                else reject(error);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

// Multiple Images
const uploadMultipleImages = async (files, folder = "products") => {
    return Promise.all(
        files.map(file => uploadSingleImage(file, folder))
    );
};

//deleted images
const deleteImage = async (public_id) => {
    if (!public_id) return;
    await cloudinary.uploader.destroy(public_id);
};

module.exports = {
    cloudinary,
    uploadSingleImage,
    uploadMultipleImages,
    deleteImage,
};
