const fs = require('fs');
const path = require('path');

const PATH_DESTINY = path.resolve('./assets/img');

class ImageHelper {

    static get(req, res) {
        const { imageUrl } = req.query;

        fs.readFile(`${PATH_DESTINY}/${imageUrl}`, (err, content) => {
            if (err) return next({ httpStatusCode: 400, responseMessage: err });
            res.writeHead(200, { 'content-type': 'image/png' });
            res.end(content);
        });
    }

    static upload(folder, file) {
        try {
            if (!fs.existsSync(`${PATH_DESTINY}/${folder}`)) {
                fs.mkdirSync(`${PATH_DESTINY}/${folder}`);
            }
            if (file.imgUrl) {
                const img = Array.isArray(file.imgUrl) ? file.imgUrl[0] : file.imgUrl;
                const urlImg = `${new Date().getTime()}.png`;
                fs.renameSync(img.path, `${PATH_DESTINY}/${folder}/${urlImg}`);
                return `${folder}/${urlImg}`;
            }
        } catch (error) {
            console.log('[error] upload image');
            console.log(error);
        }
    }

    static deleteFile(pathFile) {
        try {
            if (fs.existsSync(`${PATH_DESTINY}/${pathFile}`)) {
                fs.unlinkSync(`${PATH_DESTINY}/${pathFile}`);
            }
        } catch (error) {
            console.log('[error] delete image');
            throw error;
        }
    }

    static deleteFolder(pathFolder) {
        try {
            if (fs.existsSync(`${PATH_DESTINY}/${pathFolder}`)) {
                fs.rmdirSync(`${PATH_DESTINY}/${pathFolder}`, { recursive: true });
            }
        } catch (error) {
            console.log('[error] delete folder');
            throw error;
        }
    }
}

module.exports = ImageHelper;
