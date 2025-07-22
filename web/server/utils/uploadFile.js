import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_SECRET_KEY
    }
});

export const uploadImages = async (files) => {

    try {
        const uploadResults = await Promise.all(
            files.map(async (file) => {
                console.log("file--->", file);
                const sanitizedName = sanitizeFilename(file.originalname);
                const uniqueKey = `uploads/${crypto.randomUUID()}_${sanitizedName}`;

                const uploadParams = {
                    Bucket: process.env.S3_BUCKET,
                    Key: uniqueKey,
                    Body: file.buffer,
                    ContentType: file.mimetype
                };

                await s3Client.send(new PutObjectCommand(uploadParams));

                const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

                return {
                    name: file.originalname,
                    url: fileUrl,
                    frameKey: file.fieldname
                };
            })
        );

        return {
            status: true,
            message: "Files uploaded successfully",
            data: uploadResults
        };

    } catch (error) {
        console.error('S3 File upload error:', error);
        return {
            status: false,
            message: error?.message || "Unknown upload error",
            data: []
        };
    }
};

const sanitizeFilename = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '_')              // Replace spaces with underscores
        .replace(/[^\w\-\.]+/g, '')        // Remove non-alphanumerics except dot, dash, underscore
        .replace(/_+/g, '_')               // Collapse multiple underscores
        .trim();
};


// export const uploadImages = async (files) => {
//     try {
//         if (!files?.length) {
//             return {
//                 status: false,
//                 message: "Files not found"
//             };
//         }

//         const uploadPromises = files.map(async (file) => {
//             console.log("file--->", file);

//             const dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

//             const storageUuid = uuidv4();
//             const originalname = file.originalname;
//             const extension = path.extname(originalname);
//             const key = `${storageUuid}${extension}`;

//             const uploadResult = await cloudinary.uploader.upload(dataURI, {
//                 public_id: 'uploaded_from_request',
//                 folder: "savonches"
//             });

//             console.log("uploadResult--->", uploadResult);

//             return {
//                 url: uploadResult.secure_url,
//                 public_id: uploadResult.public_id
//             };
//         });

//         const imagesData = await Promise.all(uploadPromises);

//         return {
//             status: true,
//             message: "Images uploaded successfully",
//             data: imagesData
//         };

//     } catch (error) {
//         console.error('Cloudinary upload error:', error);
//         return {
//             status: false,
//             message: error?.message || "Cloudinary upload error"
//         };
//     }
// };
