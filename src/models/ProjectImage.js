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

module.exports = ProjectImage;
