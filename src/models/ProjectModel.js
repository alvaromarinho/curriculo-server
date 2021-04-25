const { Model, sqlFunc } = require('./Model');
const ProjectImagesModel = require('./ProjectImagesModel');

const projectImagesModel = new ProjectImagesModel();

class ProjectsModel {

    constructor() {
        this.model = new Model('projects');
    }

    async createProject(req) {
        try {
            
            const result = await this.model.execute(sqlFunc.INSERT, new Project(req.body).toDb(req.params.portfolioId));
            const project = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
            if (!project) return;
    
            if (req.files) {
                project.images = [];
                for (const image of req.files.images) {
                    project.images.push(await projectImagesModel.createProjectImage(project.id, image, req.user.email));
                }
            }
    
            return new Project(project);
        } catch (error) {
            console.log(error);
        }
    }

    async findProjectsBy(filter) {
        const projects = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (!projects) return;

        if (Array.isArray(projects)) {
            for (const project of projects) {
                project.images = await projectImagesModel.findProjectImagesBy({ project_id: project.id }) || [];
            }
            return projects.map((res) => new Project(res));
        } else {
            projects.images = await projectImagesModel.findProjectImagesBy({ project_id: projects.id }) || [];
            return new Project(projects);
        }
    }

    async updateProject(obj) {
        await this.model.execute(sqlFunc.UPDATE, new Project(obj).toDb(), { id: obj.id });
        const project = await this.model.execute(sqlFunc.SELECT, null, { id: obj.id });
        if (!project) return;

        return new Project(project);
    }

    async deleteProject(filter) {
        const projects = await this.model.execute(sqlFunc.SELECT, null, filter);
        const projectsToDeleteId = []

        if (Array.isArray(projects)) {
            projects.map((p) => projectsToDeleteId.push(p.id));
        } else {
            projectsToDeleteId.push(projects.id)
        }

        await projectImagesModel.deleteProjectImage(`project_id IN (${projectsToDeleteId})`);
        return await this.model.execute(sqlFunc.DELETE, null, filter);
    }
}

class Project {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.subtitle = obj.subtitle;
        this.description = obj.description;
        this.url = obj.url;
        this.images = obj.images;
    }

    toDb(portfolioId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
            url: this.url,
            portfolio_id: portfolioId
        }));
    }
}

module.exports = ProjectsModel;
