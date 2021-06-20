const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/login', login);
router.post('/register', register);
router.get('/user', getUserDetails);

module.exports = router;

function login(req, res, next) {
  userService.authenticate(req.body)
    .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
    .catch(err => next(err));
}

function register(req, res, next) {
  userService.create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function getUserDetails(req, res, next) {
  userService.getById(req.user.sub)
    .then(user => {
      if (user) {
        let userJson = user.toJSON();
        // security-reson: removing user sub from the response
        delete userJson.createdDate;
        delete userJson.id;
        return res.send(userJson);
      }
      else
        res.sendStatus(404);
    })
    .catch(err => next(err));
}
