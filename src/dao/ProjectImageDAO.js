const { DAO, sql } = require('./DAO');
const ProjectImage = require('../models/ProjectImage');
const ImageHelper = require('../helpers/ImageHelper');

class ProjectImageDAO extends DAO {

    constructor() {
        super('project_images');
    }

    async createProjectImage(projectId, file, folder) {
        const obj = { url: ImageHelper.upload(folder, file), projectId }
        const result = await this.execute(sql.INSERT, new ProjectImage(obj).toDb(projectId));
        const [projectImage] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!projectImage) return;

        return new ProjectImage(projectImage);
    }

    async findProjectImagesBy(filter) {
        const projectImages = await this.execute(sql.SELECT, null, filter);
        if (!projectImages) return;

        return projectImages.map((res) => new ProjectImage(res));
    }

    async deleteProjectImage(filter) {
        const projectImages = await this.execute(sql.SELECT, null, filter);
        projectImages.map((pi) => ImageHelper.deleteFile(pi.url));
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new ProjectImageDAO();
