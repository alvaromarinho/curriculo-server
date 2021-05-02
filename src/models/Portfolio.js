export class Portfolio {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.projects = obj.projects;
        this.userId = obj.userId || obj.user_id;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            name: this.name,
            user_id: userId
        }));
    }
}