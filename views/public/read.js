const express = require("express");
const parse = require("csv-parse").parse;
const multer = require("multer");
const os = require("os");
const fs = require("fs");
const bodyParser = require("body-parser");
const stringify = require("csv-stringify").stringify;
const upload = multer({ dest: os.tmpdir() });
const app = express();
app.post("/read", upload.single("file"), (req, res) => {
  const file = req.file;

  const data = fs.readFileSync(file.path);
  parse(data, (err, records) => {
    if (err) {
      console.error(err);
      return res
        .status(400)
        .json({ success: false, message: "An error occurred" });
    }

    return res.json({ data: records });
  });
});
