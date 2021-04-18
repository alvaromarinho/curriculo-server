const express = require("express");
const router = express.Router();
const middleAuth = require("./middlewares/auth");
// const middleVerifyOwner = require("./middlewares/VerifyUser");
const UsersController = require('./controllers/UsersController');
// const ProjectsController = require("./controllers/ProjectsController");
// const TasksController = require("./controllers/TasksController");


//users
router.post('/api/auth',UsersController.auth);
router.post('/api/user', UsersController.createUser);
router.get('/api/user', middleAuth, UsersController.findUser);
router.put('/api/user', middleAuth, UsersController.updateUser);
router.delete('/api/user', middleAuth, UsersController.deleteUser);


router.get('/api/image', UsersController.getImage);

//projects
// router.post('/api/project', middleAuth, ProjectsController.store);
// router.get('/api/projects', middleAuth, ProjectsController.indexAllByUser);
// router.put("/api/project/:id", middleAuth, middleVerifyOwner({ model: 'project' }), ProjectsController.update);
// router.delete("/api/project/:id", middleAuth, middleVerifyOwner({ model: 'project' }), ProjectsController.delete);

// //tasks
// router.post('/api/task', middleAuth, middleVerifyOwner({ model: 'project_task' }), TasksController.store);
// router.get('/api/tasks/:project', middleAuth, middleVerifyOwner({ model: 'get_task_by_project' }),TasksController.indexByProject);
// router.put("/api/task/:id", middleAuth, middleVerifyOwner({ model: 'task' }), TasksController.update);
// router.delete("/api/task/:id", middleAuth, middleVerifyOwner({ model: 'task' }), TasksController.delete);

module.exports = router;
