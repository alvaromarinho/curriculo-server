const express = require("express");
const router = express.Router();
const middleAuth = require("./middlewares/Auth");

const ImageHelper = require('./helpers/ImageHelper');
const usersController = require('./controllers/UsersController');
const informationsController = require('./controllers/InformationsController');

// router.get('/api/site/:id', sitesController.getAll);
router.post('/api/auth', usersController.auth);
router.get('/api/image', (req, res) => ImageHelper.get(req, res));

// users
router.post('/api/user', usersController.create);
router.get('/api/user', middleAuth, usersController.find);
router.put('/api/user', middleAuth, usersController.update);
router.delete('/api/user', middleAuth, usersController.remove);

// informations
router.post('/api/informations', middleAuth, informationsController.create);
router.get('/api/informations', middleAuth, informationsController.find);
router.get('/api/informations/:type', middleAuth, informationsController.findByType);
router.put('/api/informations/:id', middleAuth, informationsController.update);
router.delete('/api/informations/:id', middleAuth, informationsController.remove);

module.exports = router;
