import fs from 'fs';

const readFile = async (route) => {
    try {
        const data = await fs.readFile(route, 'utf8');
        return JSON.parse(data)
    } catch (error) {
      throw new Error(`Error in readFile: ${error.message}`);    
    }
}

const writeFile = async (route, newData) => {
    try {
        const writeFileFs = await fs.writeFile(route, JSON.stringify(newData, null, 2));
        console.log(`data is actualizated add data ${writeFileFs}`);
    } catch (error) {
        throw new Error(`Error in writeFile: ${error.message}, ${error.stack}`);
    }
    

};

export default {
    readFile,
    writeFile,
 };
