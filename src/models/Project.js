export class Project {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.subtitle = obj.subtitle;
        this.description = obj.description;
        this.url = obj.url;
        this.images = obj.images;
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