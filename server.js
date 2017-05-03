'use strict';

const cfenv = require('cfenv');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;


app.use(bodyParser.json());

// Emulating VCAP_VARIABLES if running in local mode
try { require("./vcap-local"); } catch (e) {}
var appEnv = cfenv.getAppEnv();


// AppMetrics monitoring instrumentation
require('appmetrics-dash').attach();


// Define public endpoints
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app/views'));


// Connect to mongo
var db;
// TODO: use vcap variables
mongodb.MongoClient.connect(appEnv.getServiceURL(/Compose for MongoDB/), (err, database) => {
  if(err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log('Database connection ready');

  // Starting the server
  const port = 'PORT' in process.env ? process.env.PORT : 8080;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});


// CRUD operations for blog post
app.post('/api/blogs', (req, res) => {
  if(!req.body || !req.body.title || !req.body.content) {
    res.status(400).send('title and content are required');
    return;
  }

  let timestamp = new Date();

  let blogPost = {
    title: req.body.title,
    content: req.body.content,
    timeCreated: timestamp,
    lastUpdated: timestamp
  };

  db.collection('blogs').insertOne(blogPost, function(err, doc) {
    if (err) {
      res.status(500).send('Failed to create blog post');
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get('/api/blogs', (req, res) => {
  db.collection('blogs').find({}).toArray(function(err, docs) {
    if (err) {
      res.status(500).send('Failed to query for blogs');
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get('/api/blogs/:id', (req, res) => {
  db.collection('blogs').findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      res.status(500).send('Failed to get blog');
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put('/api/blogs/:id', (req, res) => {
  var blogPost = req.body;
  delete blogPost._id;
  blogPost.lastUpdated = new Date();

  db.collection('blogs').updateOne({_id: new ObjectID(req.params.id)}, blogPost, function(err) {
    if (err) {
      res.status(500).send('Failed to update blog');
    } else {
      blogPost._id = req.params.id;
      res.status(200).json(blogPost);
    }
  });
});

app.delete('/api/blogs/:id', (req, res) => {
  db.collection('blogs').deleteOne({_id: new ObjectID(req.params.id)}, function(err) {
    if (err) {
      res.status(500).send('Failed to delete blog');
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
