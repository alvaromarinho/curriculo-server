import { readFile, existsSync, mkdirSync, renameSync, unlinkSync, rmdirSync } from 'fs';
import { resolve } from 'path';

const PATH_DESTINY = resolve('./assets/img');

export const getImage = (req, res) => {
    const { imageUrl } = req.query;

    readFile(`${PATH_DESTINY}/${imageUrl}`, (err, content) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err });
        res.writeHead(200, { 'content-type': 'image/png' });
        res.end(content);
    });
}

export const uploadImage = (folder, file) => {
    try {
        if (!existsSync(`${PATH_DESTINY}/${folder}`)) {
            mkdirSync(`${PATH_DESTINY}/${folder}`, { recursive: true });
        }
        if (file) {
            const urlImg = `${new Date().getTime()}.png`;
            renameSync(file.path, `${PATH_DESTINY}/${folder}/${urlImg}`);
            return `${folder}/${urlImg}`;
        }
    } catch (error) {
        console.log('[error] upload image');
        console.log(error);
    }
}

export const deleteFile = (pathFile) => {
    try {
        if (existsSync(`${PATH_DESTINY}/${pathFile}`)) {
            unlinkSync(`${PATH_DESTINY}/${pathFile}`);
        }
    } catch (error) {
        console.log('[error] delete file');
        throw error;
    }
}

export const deleteFolder = (pathFolder) => {
    try {
        if (existsSync(`${PATH_DESTINY}/${pathFolder}`)) {
            rmdirSync(`${PATH_DESTINY}/${pathFolder}`, { recursive: true });
        }
    } catch (error) {
        console.log('[error] delete folder');
        throw error;
    }
}