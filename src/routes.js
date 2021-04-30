const express = require("express");
const router = express.Router();
const middleAuth = require("./middlewares/AuthMiddleware");

const ImageHelper = require('./helpers/ImageHelper');
const usersController = require('./controllers/UsersController');
const informationsController = require('./controllers/InformationsController');
const portfoliosController = require('./controllers/PortfoliosController');
const projectsController = require('./controllers/ProjectsController');

// router log
router.use((req, res, next) => {
    console.log(`[${req.method}] ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} => ${req.url}`);
    next();
});

router.get('/api', (req, res) => res.status(200).json('curriculum v1.0.0'));
router.post('/api/auth', usersController.auth);
// router.get('/api/site/:id', sitesController.getAll);

// image
router.get('/api/image', (req, res) => ImageHelper.get(req, res));
// router.delete('/api/image', (req, res) => ImageHelper.deleteFile(req, res));

// users
router.post('/api/user', usersController.create);
router.get('/api/user', middleAuth, usersController.find);
router.put('/api/user', middleAuth, usersController.update);
router.delete('/api/user', middleAuth, usersController.remove);

// informations
router.post('/api/informations', middleAuth, informationsController.create);
router.get('/api/informations', middleAuth, informationsController.find);
router.put('/api/informations/:informationId', middleAuth, informationsController.resourceOwner, informationsController.update);
router.delete('/api/informations/:informationId', middleAuth, informationsController.resourceOwner, informationsController.remove);

// portfolios
router.post('/api/portfolios', middleAuth, portfoliosController.create);
router.get('/api/portfolios', middleAuth, portfoliosController.find);
router.put('/api/portfolios/:portfolioId', middleAuth, portfoliosController.resourceOwner, portfoliosController.update);
router.delete('/api/portfolios/:portfolioId', middleAuth, portfoliosController.resourceOwner, portfoliosController.remove);

// projects
router.post('/api/portfolios/:portfolioId/projects', middleAuth, portfoliosController.resourceOwner, projectsController.create);
router.get('/api/portfolios/:portfolioId/projects/:projectId', middleAuth, portfoliosController.resourceOwner, projectsController.find);
router.put('/api/portfolios/:portfolioId/projects/:projectId', middleAuth, portfoliosController.resourceOwner, projectsController.update);
router.delete('/api/portfolios/:portfolioId/projects/:projectId', middleAuth, portfoliosController.resourceOwner, projectsController.remove);

module.exports = router;