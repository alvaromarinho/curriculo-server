const express = require('express');
const router = express.Router();
const authMiddle = require('./middlewares/AuthMiddleware');

const { getImage, deleteFile } = require('./helpers/ImageHelper');
const user = require('./controllers/UsersController');
const info = require('./controllers/InformationsController');
const portfolio = require('./controllers/PortfoliosController');
const project = require('./controllers/ProjectsController');

// router log
router.use((req, res, next) => {
    console.log(`[${req.method}] ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} => ${req.url}`);
    next();
});

router.get('/curriculo', (req, res) => res.status(200).json('curriculum v1.0.0'));
router.post('/curriculo/auth', user.auth);
router.get('/curriculo/image', (req, res) => getImage(req, res));
// router.delete('/curriculo/image', (req, res) => deleteFile(req, res));

// users
router.get('/curriculo/user/:userId', user.findAllData);
router.post('/curriculo/user', authMiddle, user.create);
router.get('/curriculo/user', authMiddle, user.find);
router.put('/curriculo/user', authMiddle, user.update);
router.delete('/curriculo/user', authMiddle, user.remove);

// informations
router.post('/curriculo/informations', authMiddle, info.create);
router.get('/curriculo/informations', authMiddle, info.find);
router.put('/curriculo/informations/:informationId', authMiddle, info.resourceOwner, info.update);
router.delete('/curriculo/informations/:informationId', authMiddle, info.resourceOwner, info.remove);

// portfolios
router.post('/curriculo/portfolios', authMiddle, portfolio.create);
router.get('/curriculo/portfolios', authMiddle, portfolio.find);
router.put('/curriculo/portfolios/:portfolioId', authMiddle, portfolio.resourceOwner, portfolio.update);
router.delete('/curriculo/portfolios/:portfolioId', authMiddle, portfolio.resourceOwner, portfolio.remove);

// projects
router.post('/curriculo/portfolios/:portfolioId/projects', authMiddle, portfolio.resourceOwner, project.create);
router.get('/curriculo/portfolios/:portfolioId/projects/:projectId', authMiddle, portfolio.resourceOwner, project.find);
router.put('/curriculo/portfolios/:portfolioId/projects/:projectId', authMiddle, portfolio.resourceOwner, project.update);
router.delete('/curriculo/portfolios/:portfolioId/projects/:projectId', authMiddle, portfolio.resourceOwner, project.remove);

module.exports = router;