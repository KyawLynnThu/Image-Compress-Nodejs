const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const sizeOf = require("image-size");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;

const app = express();
const upload = multer({ dest: "uploads/" });
const outputFolder = "compress/";

const rootDir = path.join(__dirname, "..");

app.post("/compress", upload.single("image"), async (req, res) => {
  // console.log(req.file);
  // const { path } = req.file;
  if (req.file) {
    var path = req.file.path.replace("\\", "/");
  }

  try {
    // Resize and compress image
    const data = await sharp(path)
      .resize({ width: 1000 })
      .jpeg({ quality: 100 })
      .toBuffer();

    // Write compressed image to file
    const filename = uuid() + ".jpg";
    try {
      fs.writeFile(outputFolder + filename, data, (err) => {
        if (err) throw err;
        console.log("File written successfully");
      });
      console.log(__dirname + path);

      // Delete uploaded image
      fs.unlink((rootDir, path), (err) => {
        if (err) console.log(err);
      });
    } catch (err) {
      console.error(err);
    }

    // Send compressed image
    res.set("Content-Type", "image/jpeg");
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during image compression.");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
