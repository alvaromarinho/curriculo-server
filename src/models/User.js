const bcrypt = require('bcrypt');

class User {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.image = obj.image;
        this.city = obj.city;
        this.uf = obj.uf;
        this.description = obj.description;
        this.phones = obj.phones;
        this.links = obj.links;
    }

    toDb(password) {
        return JSON.parse(JSON.stringify({
            name: this.name,
            email: this.email,
            image: this.image,
            city: this.city,
            uf: this.uf,
            password: password && bcrypt.hashSync(password, bcrypt.genSaltSync()),
            description: this.description,
        }));
    }
}

module.exports = User;