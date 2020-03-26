var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Classy' });
});


router.get('/home', (req, res, next) => {
  res.render('landing-page')
});

router.get('/user-interface', (req, res, next) => {
  res.render('user-interface')
});


module.exports= router