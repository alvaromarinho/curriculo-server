export class SocialNetwork {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.icon = obj.icon;
        this.url = obj.url;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            name: this.name,
            icon: this.icon,
            url: this.url,
            user_id: userId
        }));
    }
}