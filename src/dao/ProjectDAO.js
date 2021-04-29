const { DAO, sql } = require('./DAO');
const Project = require('../models/Project');
const projectImagesDAO = require('./ProjectImageDAO');

class ProjectDAO extends DAO {

    constructor() {
        super('projects');
    }

    async createProject(req) {
        const result = await this.execute(sql.INSERT, new Project(req.body).toDb(req.params.portfolioId));
        const [project] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!project) throw new CustomError(404, 'Error creating project');

        if (req.files) {
            project.images = [];
            for (const image of req.files.images) {
                project.images.push(await projectImagesDAO.createProjectImage(project.id, image, req.user.email));
            }
        }

        return new Project(project);
    }

    async findProjectsBy(filter) {
        const projects = await this.execute(sql.SELECT, null, filter);
        if (!projects) throw new CustomError(404, 'Not found');

        for (const project of projects) {
            project.images = await projectImagesDAO.findProjectImagesBy({ project_id: project.id }) || [];
        }

        return projects.map((res) => new Project(res));
    }

    async updateProject(obj) {
        await this.execute(sql.UPDATE, new Project(obj).toDb(), { id: obj.id });
        const [project] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!project) throw new CustomError(404, 'Not found');;

        project.images = await projectImagesDAO.findProjectImagesBy({ project_id: project.id }) || [];
        return new Project(project);
    }

    async deleteProject(filter) {
        const projects = await this.execute(sql.SELECT, null, filter);
        
        const projectsToDeleteId = []
        projects.map((p) => projectsToDeleteId.push(p.id));

        await projectImagesDAO.deleteProjectImage(`project_id IN (${projectsToDeleteId})`);
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new ProjectDAO();
