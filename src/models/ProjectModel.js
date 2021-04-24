const { Model, sqlFunc } = require('./Model');

class ProjectsModel {

    constructor() {
        this.model = new Model('projects');
    }

    async createProject(obj) {
        const result = await this.model.execute(sqlFunc.INSERT, new Project(obj).toDb(obj.portfolioId));
        const project = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!project) return;

        return new Project(project);
    }

    async findProjectsBy(filter) {
        const projects = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (!projects) return;

        return Array.isArray(projects) ? projects.map((res) => new Project(res)) : new Project(projects);
    }

    async updateProject(obj) {
        await this.model.execute(sqlFunc.UPDATE, new Project(obj).toDb(), { id: obj.id });
        const project = await this.model.execute(sqlFunc.SELECT, null, { id: obj.id });
        if (!project) return;

        return new Project(project);
    }

    async deleteProject(filter) {
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
