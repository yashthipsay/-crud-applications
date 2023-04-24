const express = require("express");
const dotenv = require("dotenv");
const parse = require("csv-parse").parse;
const app = express();
const multer = require("multer");
const os = require("os");
const fs = require("fs");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const connectDB = require("./server/database/connection");
const stringify = require("csv-stringify").stringify;
const upload = multer({ dest: os.tmpdir() });

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

//log requests
app.use(morgan("tiny"));

//mongodb connection
connectDB();

//set view engine
app.set("view engine", "ejs");

//If a sub-directory is created in views, it needs to be specified
// app.set('views', path.resolve(__dirname, "views/ejs"));

//parse request to body parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/js", express.static(path.resolve(__dirname, "views")));

// app.get('/', (req, res)=>{
//   res.render('index');
// })

// app.get('/add_user', (req, res)=>{
//   res.render('add_user');
// })

// app.get('/update-user', (req, res)=>{
//   res.render('update_user');
// })

//loading routers
app.use("/", require("./server/routes/router"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/read", upload.single("file"), (req, res) => {
  // method is used to define the endpoint and specify the middleware functions to be executed when the endpoint is accessed.
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
