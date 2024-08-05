import { readFile } from './fs.js'

const getFilePath =  (router, url) => {
    router.get(url, async (req, res) => {
        const data = await readFile(url);
        res.json(data);
    });
}

export default getFilePath;