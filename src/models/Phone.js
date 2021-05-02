export class Phone {
    constructor(obj) {
        this.id = obj.id;
        this.number = obj.number;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            number: this.number,
            user_id: userId
        }));
    }
}