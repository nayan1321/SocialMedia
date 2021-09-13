const multer = require("multer");

exports.singleUpload = () => {
   try {
      const storage = multer.diskStorage({
         destination: function (req, file, cb) {
            cb(null, "./upload");
         },
         filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname);
         },
      });
      const filefilter = (req, file, cb) => {
         if ((file.mimetype = "image.png" || file.mimetype === "image.jpg")) {
            cb(null, true);
         } else {
            cb(null, false);
         }
      };
      return multer({ storage: storage, fileFilter: filefilter }).single(
         "file"
      );
   } catch (error) {
      console.log("error from file upload", error);
   }
};
