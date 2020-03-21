const express = require('express');
const router = express.Router();

const User = require('../../models/user');
const Class = require('../../models/class');


router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
      return;
    }
  
    res.redirect('/auth/login');
  });
  
  router.get('/classy', (req, res, next) => {
    let query;
  
    if (req.session.currentUser.isTeacher) {
      query = { teacher: req.session.currentUser._id };
    } else {
      query = { user: req.session.currentUser._id };
    }
  
    Class
      .find(query)
      .populate('user', 'name')
      .populate('teacher', 'name')
      .sort('classDate')
      .exec((err, classesDoc) => {
        if (err) {
          next(err);
          return;
        }
  
        res.render('user-interface.hbs', {classes: classesDoc});
      });
  });


  module.exports = router