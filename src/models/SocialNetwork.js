class SocialNetwork {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.url = obj.url;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            name: this.name,
            url: this.url,
            user_id: userId
        }));
    }
}

module.exports = SocialNetwork;