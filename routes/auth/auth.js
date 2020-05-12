const express = require('express');
const router = express.Router();

const User = require('../../models/user.js');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//SIGN-UP


router.get('/signup', (req, res, next) => {
  !req.session.currentUser ? res.render('signup.hbs') : res.redirect('/classy/classy')

});


router.post('/signup', (req, res, next) => {
  let { email, name, password, isTeacher, classPrice } = req.body;

  //console.log(isTeacher)

  if (name === '' || password === '') {
    res.render('signup.hbs', {
      errorMessage: 'Please fill all the fields to sign up'
    });
    return;

  } else if (isTeacher === 'on' && classPrice === null) {
    res.render('signup.hbs', {
      errorMessage: 'You have to set a Class price',
    });
    return;

  } else if (isTeacher === 'on') {
    isTeacher = true
  }

  User.findOne({ name })
    .then(user => {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      if (user !== null) {
        res.render('signup.hbs', {
          errorMessage: 'The name already exists!'
        });
        return;
      }


      User.create({ name, email, password: hashPass, isTeacher, classPrice })
        .then(() => {
          res.redirect('/classy/classy');
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});


//////////////////////////////////////
//LOGIN
router.get('/login', (req, res, next) => {

  !req.session.currentUser ? res.render('login') : res.redirect('/classy/classy')

})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body
  if (email === '' || password === '') {
    res.render('login.hbs', {
      errorMessage: 'Please provide a username and password to log in'
    });
    return;
  }

  User.findOne({ email }, (err, oneUser) => {
    if (err || oneUser === null) {
      res.render('login', {
        errorMessage: `There isn't an account with email ${email}.`
      });
      return;
    }


    if (!bcrypt.compareSync(password, oneUser.password)) {
      res.render('login', {
        errorMessage: 'Invalid password.'
      });
      return;
    }

    req.session.currentUser = oneUser;
    res.redirect('/classy/classy');
  });
});


//////
//LOG-OUT


router.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/');
  });
});


module.exports = router;