const express = require('express');
const router = express.Router();

const User = require('../../models/user.js');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//SIGN-UP


router.get('/signup', (req, res, next) => {
    res.render('signup.hbs');
})


router.post('/signup', (req, res, next) => {
    const { email, name, password } = req.body;
  
    if (name === '' || password === '') {
      res.render('signup.hbs', {
        errorMessage: 'Please provide a name and password to sign up'
      });
      return;
    }
  
    User.findOne({ name })
      .then(user => {
        if (user !== null) {
          res.render('signup.hbs', {
            errorMessage: 'The name already exists!'
          });
          return;
        }
  
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
  
        User.create({ name, email, password: hashPass, })
          .then(() => {
            res.redirect('/auth/login');rs
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
router.get('/login', (req, res, next) =>{

    res.render('login.hbs')
    
})


router.post('/login', (req, res,next) => {
    const {email, password} = req.body
    if (email === '' || password === '') {
        res.render('login.hbs', {
          errorMessage: 'Please provide a username and password to log in'
        });
        return;
      }
     
    User.findOne({email})
    .then(user => {
        if(!user){
            res.render('login.hbs', {
            errorMessage: 'The username does not exist'
        })
        return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
        console.log("usuario registrado")
        res.render('user-landing.hbs');
      } else {
        res.render('login.hbs', {
        errorMessage: 'Incorrect password'
        });
    }
  })
  .catch(error => {
    next(error);
  });

  res.redirect('/classy')
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