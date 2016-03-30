const express = require('express');
const authController = require('./authController');


const passport = require('passport');

const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
// this has to do with the instagram session:

// My try:
router.get('/instagram',
  passport.authenticate('instagram', { session: false }),
  (req, res) => {
    // The request will be redirected to Instagram for authentication, so this
    // function will not be called.
  });

const jwt = require('jsonwebtoken');

router.get('/instagram/callback', (req, res, next) => {
  passport.authenticate('instagram', {
    scope: ['public_content'],
    failureRedirect: '/' },
  (err, user, info) => {
    console.log('\tinside callback thingy')
    console.log('this is user', user);
    console.log('this is info', info);
    if (err) {
      console.log('error', err);
      return next(err);
    }
    if (!user) {
      console.log('no user!');
      return res.redirect('/');
    }
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: 10080 });
    const userId = user.get('id');
    res.redirect(`/signin?token=${token}&userId=${userId}`);
  })(req, res, next);
});

module.exports = router;
