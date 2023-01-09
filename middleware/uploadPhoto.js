import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "snap-shot/profile",
      // public_id: "post",
    };
  },
});
export const uploadProfilePic = multer({ storage: profilePicStorage });

const postImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "snap-shot/post",
      // public_id: "post",
    };
  },
});
export const uploadPostImage = multer({ storage: postImageStorage });

// const postImageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/assets/post-image");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// export const uploadPostImage = multer({ storage: postImageStorage });
