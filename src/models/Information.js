export class Information {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.subtitle = obj.subtitle;
        this.description = obj.description;
        this.type = obj.type;
        this.start = obj.start;
        this.end = obj.end;
        this.userId = obj.userId || obj.user_id;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
            type: this.type,
            start: this.start,
            end: this.end,
            user_id: userId
        }));
    }
}