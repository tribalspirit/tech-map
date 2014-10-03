var express = require('express');
var router = express.Router();

var map = require('../controllers/map-controller')


/* GET users listing. */

router.route('/map')

.get(function(req, res) {
  res.json(map.getData());
});

module.exports = router;
