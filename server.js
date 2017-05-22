/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

'use strict';

const cfenv = require('cfenv');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('mongodb');
var db;
const blogsRoutes = require('./server/routers/blogs');


app.use(bodyParser.json());

// Emulating VCAP_VARIABLES if running in local mode
try { require("./vcap-local"); } catch (e) {}
var appEnv = cfenv.getAppEnv();


// AppMetrics monitoring instrumentation
require('appmetrics-dash').attach();


// Define public endpoints
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app/views'));

var useMongo = function(req, resp, next){
  req.mongoDb = db;
  req.mongoObjectId = mongodb.ObjectID;
  next();
};

app.use('/api/blogs', useMongo, blogsRoutes);


// Connect to mongo
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
