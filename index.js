require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const url = require('url');
const mongoose = require('mongoose');
const { type } = require('os');
const bodyParser = require('body-parser');
const { error } = require('console');
const validator = require("validator");


app.use(bodyParser.urlencoded({ extended: false }))

const DB = mongoose.connect('mongodb://localhost:27017/url')
  .then(() => {
    console.log("mongodb connected!!");
  }).catch(() => {
    console.log("faild to connect");
  })

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true, unique: true }
})

const NewURL = mongoose.model('URL', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

const isValidURL = (url) => {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
};

let id = 1;
app.post("/api/shorturl/", async (req, res) => {

  console.log("first");
  const original_url = req.body.url;
  if (!isValidURL(original_url)) {
    res.json({ error: 'invalid url' });
  } else {

    console.log("second");
    try {
      const existingURL = await NewURL.findOne({ original_url });
      if (existingURL) {
        console.log("first1")
        return res.json({ original_url: existingURL.original_url, short_url: existingURL.short_url })

      }
      console.log("third");
      const newUrl = new NewURL({
        original_url,
        short_url: ++id
      })
      await newUrl.save();
      res.json({ original_url: newUrl.original_url, short_url: newUrl.short_url });
      console.log("fourth");
    }
    catch (error) {
      console.log(error);
      res.status(500).json("internal server error");
    }
  }
})

app.get("/api/shorturl/:id", async (req, res) => {
  const shortId = req.params.id;

  try {
    const urlDoc = await NewURL.findOne({ short_url: shortId });
    if (!urlDoc) {
      return res.status(404).json("Not found url");
    }
    res.redirect(urlDoc.original_url);

  } catch (error) {
    console.log(error);
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
