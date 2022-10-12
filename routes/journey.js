var express = require('express');
var router = express.Router();
const db = require("../model/helper");

/* GET journeys listed */
router.get('/', function(req, res, next) {
  //res.send({message: 'Welcome to the journey statistics!'});
  db("SELECT * FROM journey_data LIMIT 20;")
  .then(results => {
    res.send(results.data);
  })
  .catch(err => res.status(500).send(err));
});

module.exports = router;