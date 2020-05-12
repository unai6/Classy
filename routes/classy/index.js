var express = require('express');
var router = express.Router();
let User = require('../../models/user')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Classy' });
});


router.get('/home', (req, res, next) => {
  User.find(
    {
      $and: [
        { isTeacher: true },
      ]
    },
    (err, teachers) => {
      if (err) {
        next(err);
        return;
      }
      res.render('landing-page', {
        teachers
      });
    }
  );
});
router.get('/user-interface', (req, res, next) => {
  res.render('user-interface')
});


module.exports = router