import { Router } from 'express';
import { getImage, deleteFile } from './helpers/ImageHelper.js';
import authMiddle from './middlewares/AuthMiddleware.js';

import user from './controllers/UsersController.js';
import info from './controllers/InformationsController.js';
import portfolio from './controllers/PortfoliosController.js';
import project from './controllers/ProjectsController.js';

const router = Router();

// router log
router.use((req, res, next) => {
    console.log(`[${req.method}] ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} => ${req.url}`);
    next();
});

router.get('/api', (req, res) => res.status(200).json('curriculum v1.0.0'));
router.post('/api/auth', user.auth);

// image
router.get('/api/image', (req, res) => getImage(req, res));
// router.delete('/api/image', (req, res) => deleteFile(req, res));

// users
router.get('/api/user/:userId', user.findAllData);
router.post('/api/user', authMiddle, user.create);
router.get('/api/user', authMiddle, user.find);
router.put('/api/user', authMiddle, user.update);
router.delete('/api/user', authMiddle, user.remove);

// informations
router.post('/api/informations', authMiddle, info.create);
router.get('/api/informations', authMiddle, info.find);
router.put('/api/informations/:informationId', authMiddle, info.resourceOwner, info.update);
router.delete('/api/informations/:informationId', authMiddle, info.resourceOwner, info.remove);

// portfolios
router.post('/api/portfolios', authMiddle, portfolio.create);
router.get('/api/portfolios', authMiddle, portfolio.find);
router.put('/api/portfolios/:portfolioId', authMiddle, portfolio.resourceOwner, portfolio.update);
router.delete('/api/portfolios/:portfolioId', authMiddle, portfolio.resourceOwner, portfolio.remove);

// projects
router.post('/api/portfolios/:portfolioId/projects', authMiddle, portfolio.resourceOwner, project.create);
router.get('/api/portfolios/:portfolioId/projects/:projectId', authMiddle, portfolio.resourceOwner, project.find);
router.put('/api/portfolios/:portfolioId/projects/:projectId', authMiddle, portfolio.resourceOwner, project.update);
router.delete('/api/portfolios/:portfolioId/projects/:projectId', authMiddle, portfolio.resourceOwner, project.remove);

export default router;