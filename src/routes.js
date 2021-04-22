const express = require("express");
const router = express.Router();
const middleAuth = require("./middlewares/Auth");

const ImageHelper = require('./helpers/ImageHelper');
const usersController = require('./controllers/UsersController');

// router.get('/api/site/:id', sitesController.getAll);
router.post('/api/auth', usersController.auth);
router.get('/api/image', (req, res) => ImageHelper.get(req, res));

// users
router.post('/api/user', usersController.createUser);
router.get('/api/user', middleAuth, usersController.findUser);
router.put('/api/user', middleAuth, usersController.updateUser);
router.delete('/api/user', middleAuth, usersController.deleteUser);

module.exports = router;
