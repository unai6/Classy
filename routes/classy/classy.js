const express = require('express');
const router = express.Router();
const moment = require('moment')
const uploadCloud = require('../../config/cloudinary.js');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../../models/user');
const Class = require('../../models/class');


router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.render('login');
});


/// RUTA INTERFAZ USUARIO

router.get('/classy', (req, res, next) => {
  let query;

  if (req.session.currentUser.isTeacher) {
    query = { teacher: req.session.currentUser._id };
  } else {
    query = { student: req.session.currentUser._id };
  }
  //console.log(req.session.currentUser.isTeacher)
  Class
    .find(query)
    .populate('student', 'name')
    .populate('teacher', 'name')
    .sort('classDate')
    .exec((err, classes) => {
      if (err) {
        next(err);
        return;
      }
      //change the view of the dates
      classes.forEach(date => {
        date.classDate2 = moment(date.classDate).format('ddd Do MMMM YYYY');
        // console.log(classes)

      });

      User.findById(req.session.currentUser).then(data => actualSessionPhoto = data.imgPath);

      req.session.reload((err) => {
          res.render('user-interface', { actualSessionPhoto, classes, isTeacher: req.session.currentUser.isTeacher});
      });
    });
});

////////////////////////////////  

router.get('/teachers', (req, res, next) => {
  User.find(
    {
      $and: [
        { isTeacher: true },
        { _id: { $ne: req.session.currentUser._id } }
      ]
    },

    (err, teachersList) => {
      if (err) {
        next(err);
        return;
      }
      res.render('teachers', {
        teachers: teachersList
      });
    }
  );
});

router.post('/teachers', (req, res, next) => {
  const userId = req.session.currentUser._id;
  const teacherInfo = {
    classPrice: req.body.classPrice,
    isTeacher: true
  };


  User.findByIdAndUpdate(userId, teacherInfo, { new: true }, (err, oneUser) => {
    if (err) {
      next(err);
      return;
    }

    req.session.currentUser = oneUser;

    res.render('teachers');
  });
});


router.get('/teachers/:id', (req, res, next) => {
  const teacher = req.params.id;

  User.findById(teacher, (err, oneUser) => {
    if (err) {
      next(err);
      return;
    }
    res.render('teacher-info', {
      teacher: oneUser
    })
  })
});


router.post('/class-book', (req, res, next) => {
  const classInfo = {
    classDate: req.body.classDate,
    teacher: req.body.teacherId,
    student: req.session.currentUser._id,
    time: req.body.time,
    description: req.body.description,
    name: req.body.name,
  };
  const theClass = new Class(classInfo);
  theClass.save((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/home');
  });
});

//// create class

router.get('/create-class', (req, res, next) => {

  User.find({ isTeacher: false },
    (err, users) => {
      if (err) {
        next(err);
        return;
      }
      //console.log(users)
      res.render('create-class.hbs', {
        users
      });
    }
  );
});


router.post('/create-class', (req, res, next) => {
  let { name, description, classDate, time, student } = req.body;
  const teacher = req.session.currentUser._id
  //console.log(student)
  if (name === '' || description === '' || classDate === '' || time === '') {
    User.find({ isTeacher: false },
      (err, users) => {
        if (err) {
          next(err);
          return;
        }
        //console.log(users)
        res.render('create-class.hbs', {
          users,
          errorMessage: 'Please fill all the fields to create a new class!'
        });
      }
    );
    return;
  }
  Class.create({ name, description, classDate, time, teacher, student })
    .then(data => {
      res.redirect('/classy/classy')
    })
});

//////Delete classes
router.post('/:id/delete', (req, res, next) => {

  Class.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/classy/classy'))

    .catch(error => next(error))
});

///edit classes
router.get("/:id/edit", (req, res, next) => {
  Class.findById(req.params.id)

    .then(classEdit => {
      res.render("class-edit", { classEdit });
    })
    .catch(e => next(e));
});

router.post('/:id', (req, res, next) => {
  const { name, description, time, classDate, } = req.body;
  const { id } = req.params;
  Class.update({ _id: id },
    { $set: { name, description, time, classDate } })
    .then(() => {
      res.redirect('/classy/classy');
    })
    .catch(next)
});

/////////////
//class-details
router.get('/:id/class-details', (req, res, next) => {
  const isTeacher = req.session.currentUser.isTeacher
  Class.findById(req.params.id)
    .then(classId => {
      res.render("class-details.hbs", { classId, isTeacher });
    })
    .catch(e => next(e));
});

router.post('/feedback/:_id', (req, res, next) => {
  const { rating, feedback } = req.body;
  const user = req.session.currentUser.name;
  const { _id } = req.params;
  Class.findByIdAndUpdate(_id,
    { $push: { feedback: { user, feedback, rating } } }
  )
    .then(clase => {
      // console.log(clase)
      // console.log("rating is", rating)
      res.redirect(`/classy/${_id}/class-details`);
    })
    .catch(error => {
      console.log(error);
    });
});

router.post('/class/:classId/feedback/:feedbackId/delete', (req, res, next) => {
  const { classId } = req.params
  //console.log(classId)
  const { feedbackId } = req.params

  Class.findByIdAndUpdate(classId, { $pull: { feedback: { _id: feedbackId } } })
    .then(function (data) {
      //console.log(data)
      res.redirect(`/classy/${classId}/class-details`)
    })
    .catch(error => {
      console.log(error)
    });
});


///////////////// profile-view
router.get('/profile', (req, res, next) => {

  User.findById(req.session.currentUser._id)
    .then(userId => {
      //console.log(userId)
      res.render("profile.hbs", userId);
    })
    .catch(e => next(e));
});


router.post('/profile/edit-profile', uploadCloud.single('photo'), async (req, res, next) => {
  const { name, password } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  try {


    await User.findOneAndUpdate({ _id: req.session.currentUser }, { name, password: hashPass, imgName, imgPath })
    res.redirect('/classy/classy')


  } catch (error) {
    res.status(404)
  }
})


module.exports = router