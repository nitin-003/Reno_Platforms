import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true, // makes sure you always get https URLs
});

export default cloudinary;


