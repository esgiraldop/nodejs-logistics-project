import { Router } from "express";
import { fileURLToPath } from "url";
import path from "path";
import { promises as fs } from "fs";

const router = Router();

const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);

const route = path.join(_dirName, "../../data/warenhouses.json");

const readFile = async () => {
    try {
        const data = await fs.readFile(route, "utf8");
        return JSON.parse(data);
    } catch (error) {
        throw new Error(error.message);
    }
};

const writeFile = async (newData) => {
    try {
        await fs.writeFile(route, JSON.stringify(newData, null, 2), 'utf8');
        console.log(`Data updated successfully`);
    } catch (error) {
        throw new Error(error.message);
    }
};

router.post('/', async (req, res) => {
    const data = await readFile();
    const newData = {
        id: data.length + 1,
        name: req.body.name,
        location: req.body.location,       
    }
    
    const response = {
        message: "Warenhouse created successfully",
        warehouse: newData
    };
    data.push(newData);
    res.status(201).json(response);

    await writeFile(data);
    res.status(201).json(newData).message('warenhouse created sucessfully');
});

router.get('/', async (req, res) => {
    try {
        const data = await readFile();
        
        const response = {
            warehouse: data
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const warehouse = data.findIndex(warehouse => warehouse.id === parseInt(req.params.id));
        if(warehouse === -1)console.log('warehouse not found');

        const response = {
            warehouse: data[warehouse]
        }

        res.json(response);
    } catch (error) {
        throw new Error(`not found this id`)
    }
});

router.put('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const warehouse = data.findIndex(warehouse => warehouse.id === parseInt(req.params.id));
        if(warehouse === -1) throw new Error('warehouse not found');
        data[warehouse] = {...data[warehouse],...req.body};
        await writeFile(data);
        res.json(data[warehouse]);
    } catch (error) {
        throw new Error(`not found this id`)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const warehouse = data.findIndex(warehouse => warehouse.id === parseInt(req.params.id));
        console.log(warehouse);
        if(warehouse === -1) return console.log('warehouse not found');
        data.splice(warehouse, 1);
        await writeFile(data);

        const response = {
            message: 'warehouse deleted successfully'
        }

        res.json(response);
    } catch (error) {
        throw new Error(`not found this id`)
    }
 
});


export default router;
