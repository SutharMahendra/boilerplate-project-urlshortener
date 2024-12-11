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
require('dotenv').config();

/**
 * URL Shortener Microservice this is problem statement 
 * in this problem i preffer mongodb compass or mongodb atlas 
 * because we store original url and it's short url 
 * example: 
 *        originalurl = https://translate.google.co.in/ 
 *        short_url = any number that you want (but unique for every url)
 * 
 */

// here bodyParser is used as middleware because we take the link from the html part of this code 

app.use(bodyParser.urlencoded({ extended: false }))

// here connection set-up for the mongodbcompass 
const DB = mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongodb connected!!");
  }).catch(() => {
    console.log("faild to connect");
  })

// here is schema for the mongodb which describe the patturn of data 
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true, unique: true }
})

// here we create a model based on our schema 
const NewURL = mongoose.model('URL', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint


// isValidURL function is use to check url is correct or not
const isValidURL = (url) => {
  try {
    const newUrl = new URL(url);
    // it must start with the http: or https:
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
};

// here id define for the short url 
let id = 1;

// here is main implementation for the post the data into mondodb 
app.post("/api/shorturl/", async (req, res) => {

  // save the url which comes from the webpage 
  // and store it in original url
  const original_url = req.body.url;

  // validite fucntion was implemented here
  if (!isValidURL(original_url)) {
    res.json({ error: 'invalid url' });
  } else {

    try {

      // now we check that original url already store in our database or not?
      const existingURL = await NewURL.findOne({ original_url });
      if (existingURL) {

        //if it's already exist in database then return the original_url and short_url 
        return res.json({ original_url: existingURL.original_url, short_url: existingURL.short_url })

      }

      // if url is not exist then we store it in database
      const newUrl = new NewURL({
        original_url,
        short_url: ++id
      })
      await newUrl.save();
      // now it's stored and return the answer
      res.json({ original_url: newUrl.original_url, short_url: newUrl.short_url });

    }
    catch (error) {
      console.log(error);
      res.status(500).json("internal server error");
    }
  }
})


// here is for redirect to original url with the help of short url
app.get("/api/shorturl/:id", async (req, res) => {
  // http://localhost:3000/api/shorturl/4 this type of url search in website 
  // we extract id from the url and store it in shortID
  const shortId = req.params.id;

  try {
    // find that shortID in database
    const urlDoc = await NewURL.findOne({ short_url: shortId });
    // shortID is not exist then return Not found url 
    if (!urlDoc) {
      return res.status(404).json("Not found url");
    }
    // otherwise redirect to the original url 
    res.redirect(urlDoc.original_url);

  } catch (error) {
    console.log(error);
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
