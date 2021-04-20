const express = require("express");
const router = express.Router();
const middleAuth = require("./middlewares/auth");
// const middleVerifyOwner = require("./middlewares/VerifyUser");

const usersController = require('./controllers/usersController');
const phonesController = require('./controllers/phonesController');

router.post('/api/auth', usersController.auth);
router.get('/api/image', usersController.getImage);

// router.get('/api/site/:id', sitesController.getAll);

// users
router.post('/api/user', usersController.createUser);
router.get('/api/user', middleAuth, usersController.findUser);
router.put('/api/user', middleAuth, usersController.updateUser);
router.delete('/api/user', middleAuth, usersController.deleteUser);

// phone
router.post('/api/phones', phonesController.createPhone);
router.get('/api/phones', middleAuth, phonesController.findPhone);
router.put('/api/phones', middleAuth, phonesController.updatePhone);
router.delete('/api/phones', middleAuth, phonesController.deletePhone);

module.exports = router;
