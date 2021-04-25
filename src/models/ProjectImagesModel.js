const { Model, sqlFunc } = require('./Model');
const ImageHelper = require('../helpers/ImageHelper');

class ProjectImagesModel {

    constructor() {
        this.model = new Model('project_images');
    }

    async createProjectImage(projectId, file, folder) {
        const obj = { url: ImageHelper.upload(folder, file), projectId }
        const result = await this.model.execute(sqlFunc.INSERT, new ProjectImage(obj).toDb(projectId));

        const projectImage = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!projectImage) return;

        return new ProjectImage(projectImage);
    }

    async findProjectImagesBy(filter) {
        const projectImages = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (!projectImages) return;

        return Array.isArray(projectImages) ? projectImages.map((res) => new ProjectImage(res)) : new ProjectImage(projectImages);
    }

    async deleteProjectImage(filter) {
        const projectImages = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (projectImages && Array.isArray(projectImages)) {
            projectImages.map((pi) => ImageHelper.deleteFile(pi.url));
        } else if (projectImages) {
            ImageHelper.deleteFile(projectImages.url)
        }

        return await this.model.execute(sqlFunc.DELETE, null, filter);
    }
}

class ProjectImage {
    constructor(obj) {
        this.id = obj.id;
        this.url = obj.url;
    }

    toDb(projectId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            url: this.url,
            project_id: projectId
        }));
    }
}

module.exports = ProjectImagesModel;
