const fs = require('fs');
const path = require('path');

const PATH_DESTINY = path.resolve('./assets/img');

const getImage = (req, res) => {
    const { imageUrl } = req.query;

    fs.readFile(`${PATH_DESTINY}/${imageUrl}`, (err, content) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err });
        res.writeHead(200, { 'content-type': 'image/png' });
        res.end(content);
    });
}

const uploadImage = (folder, file) => {
    try {
        if (!fs.existsSync(`${PATH_DESTINY}/${folder}`)) {
            fs.mkdirSync(`${PATH_DESTINY}/${folder}`, { recursive: true });
        }
        if (file) {
            const urlImg = `${new Date().getTime()}.png`;
            fs.copyFile(file.path, `${PATH_DESTINY}/${folder}/${urlImg}`, (err) => {
                if (err) throw err;
            });
            return `/${folder}/${urlImg}`;
        }
    } catch (error) {
        console.log('[error] upload image');
        throw error;
    }
}

const deleteFile = (pathFile) => {
    try {
        if (fs.existsSync(`${PATH_DESTINY}/${pathFile}`)) {
            fs.unlinkSync(`${PATH_DESTINY}/${pathFile}`);
        }
    } catch (error) {
        console.log('[error] delete file');
        throw error;
    }
}

const deleteFolder = (pathFolder) => {
    try {
        if (fs.existsSync(`${PATH_DESTINY}/${pathFolder}`)) {
            fs.rmdirSync(`${PATH_DESTINY}/${pathFolder}`, { recursive: true });
        }
    } catch (error) {
        console.log('[error] delete folder');
        throw error;
    }
}

module.exports = { getImage, uploadImage, deleteFile, deleteFolder }