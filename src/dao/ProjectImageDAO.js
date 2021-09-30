const { DAO, sql } = require('./DAO');
const { uploadImage, deleteFile } = require('../helpers/ImageHelper');
const CustomError = require('../models/CustomError');
const ProjectImage = require('../models/ProjectImage');

class ProjectImageDAO extends DAO {

    constructor() {
        super('project_images');
    }

    async create(projectId, file, folder) {
        const obj = { url: uploadImage(folder, file), projectId }
        const result = await this.execute(sql.INSERT, new ProjectImage(obj).toDb(projectId));
        const [projectImage] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!projectImage) throw new CustomError(404, 'Error creating project image');

        return new ProjectImage(projectImage);
    }

    async findBy(filter) {
        const projectImages = await this.execute(sql.SELECT, null, filter);
        if (!projectImages) throw new CustomError(404, 'No project image found');

        return projectImages.map((res) => new ProjectImage(res));
    }

    async remove(filter) {
        const projectImages = await this.execute(sql.SELECT, null, filter);
        projectImages.map((pi) => deleteFile(pi.url));
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new ProjectImageDAO();