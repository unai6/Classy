const express = require('express');
const router = express.Router();
const moment= require('moment')

const User = require('../../models/user');
const Class = require('../../models/class');


router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
      return;
    }
  
    res.redirect('/auth/login');
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
          date.classDate2 = moment(date.classDate).format('ddd Do MMMM YYYY')
        })
          
        res.render('user-interface.hbs', {classes, isTeacher: req.session.currentUser.isTeacher});
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
        fee: req.body.fee,
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


    router.get('/teachers/:id', (req, res, next) =>
    {
    const teacherId = req.params.id;
    User.findById(teacherId, (err, oneUser) => {
      if (err) {
        next(err);
        return;
      }
      res.render('user-profile', {
        theTeacher: oneUser
      });
    });
    });
    
    
    router.post('/class-book', (req, res, next) => {
      const classInfo = {
        classDate: req.body.classDate,
        teacher: req.body.teacherId,
        user: req.session.currentUser._id
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
  
    User.find( {isTeacher: false },
      (err, users) => {
        if (err) {
          next(err);
          return;
        }
        console.log(users)
        res.render('create-class.hbs', {
          users
        });
      }
    );
  });


    router.post('/create-class', (req, res, next) => {

      let {name, description, classDate, time, student} = req.body;
      const teacher = req.session.currentUser._id
      console.log(student)


       Class.create({name, description, classDate, time, teacher, student})
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
      res.render("class-edit", {classEdit});
    })
    .catch(e => next(e));
});

router.post ('/:id', (req, res, next) => {
  const { name, description, classDate} = req.body;
  const {id} = req.params;
  Class.update({_id: id},
      {$set: {name, description, classDate}})
      .then(() => {
      res.redirect('/classy/classy');
      })
      .catch(next)
});

/////////////
//class-details

/*router.get('/class-details', (req, res, next)=> {
  
  res.render('class-details')
})
router.get('/classy/class-details/:classId', (req, res, next) => {
  let classId = req.params.classId;
  if (!/^[0-9a-fA-F]{24}$/.test(classId)) { 
    return res.status(404).render('not-found');
  }
  Class.findOne({'_id': classId})
    .then(data => {
      if (!data) {
          return res.status(404).render('not-found');
      }
      res.render("class-details", { data })
    })
    .catch(next)
});

router.post('/class-details', (req, res, next) => {
    const { description, feedback, rating } = req.body;
   
    Class.update(
      { _id: req.query.data_id },
      { $push: {description, feedback, rating } }
    )
      .then(data => {
        res.redirect('/classy/class-details');
      })
      .catch(error => {
        console.log(error);
      });
  });*/





module.exports= router