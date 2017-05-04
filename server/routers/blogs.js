let express = require('express');
let router = express.Router();

// CRUD operations for blog post
router.post('/', (req, res) => {
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

  req.mongoDb.collection('blogs').insertOne(blogPost, function(err, doc) {
    if (err) {
      res.status(500).send('Failed to create blog post');
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

router.get('/', (req, res) => {
  req.mongoDb.collection('blogs').find({}).toArray(function(err, docs) {
    if (err) {
      res.status(500).send('Failed to query for blogs');
    } else {
      res.status(200).json(docs);
    }
  });
});

router.get('/:id', (req, res) => {
  req.mongoDb.collection('blogs').findOne({ _id: new req.mongoObjectId(req.params.id) }, function(err, doc) {
    if (err) {
      res.status(500).send('Failed to get blog');
    } else {
      res.status(200).json(doc);
    }
  });
});

router.put('/:id', (req, res) => {
  var blogPost = req.body;
  delete blogPost._id;
  blogPost.lastUpdated = new Date();

  req.mongoDb.collection('blogs').updateOne({_id: new req.mongoObjectId(req.params.id)}, blogPost, function(err) {
    if (err) {
      res.status(500).send('Failed to update blog');
    } else {
      blogPost._id = req.params.id;
      res.status(200).json(blogPost);
    }
  });
});

router.delete('/:id', (req, res) => {
  req.mongoDb.collection('blogs').deleteOne({_id: new req.mongoObjectId(req.params.id)}, function(err) {
    if (err) {
      res.status(500).send('Failed to delete blog');
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

module.exports = router;