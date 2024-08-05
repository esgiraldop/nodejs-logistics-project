import { Router } from "express";
import path from "path";
import url from "url";
import { promises as fs } from "fs";


const routerDriver = Router();

const _fileName = url.fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);

const route = path.join(_dirName, "../../data/drivers.json");

const readFile = async () => {
    try {
        const data = await fs.readFile(route, "utf8");
        return JSON.parse(data);
    } catch (error) {
        throw new Error(error.message);
    }
};

const writeFile = async (data) => {
    try {
        await fs.writeFile(route, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Data updated successfully`);
    } catch (error) {
        throw new Error(error.message);
    }
};

routerDriver.post('/', async (req, res) => {
    try {
        const data = await readFile();
        const newDriver = {
            id: data.length + 1,
            name: req.body.name
        };
        data.push(newDriver);
        await writeFile(data);
        res.status(201).json({ message: "Driver added successfully", driver: newDriver });
    } catch (error) {
        throw new Error(error);
    }
});

routerDriver.get('/', async (req, res) => {
    try {
        const data = await readFile();
        res.json({message: "Drivers", driver: data});
    } catch (error) {
        throw new Error(error);
    }
});

routerDriver.get('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const driverIndex = data.findIndex(driver => driver.id === parseInt(req.params.id));
        if (driverIndex === -1) return res.status(404).json({ message: "Driver not found" });
        res.json({ message: "Driver", driver: data[driverIndex] });
    } catch (error) {
        throw new Error(error);
    } 
});

routerDriver.put('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const driverIndex = data.findIndex(driver => driver.id === parseInt(req.params.id));
        if (driverIndex === -1) return res.status(404).json({ message: "Driver not found" });
        data[driverIndex] = { ...data[driverIndex], ...req.body };
        await writeFile(data);
        res.json({ message: "Driver updated successfully", driver: data[driverIndex] });
    } catch (error) {
        throw new Error(error);
    }                        
});

routerDriver.delete('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const driverIndex = data.findIndex(driver => driver.id === parseInt(req.params.id));
        if (driverIndex === -1) return res.status(404).json({ message: "Driver not found" });
        data.splice(driverIndex, 1);
        await writeFile(data);
        res.json({ message: "Driver deleted successfully" });

    } catch (error) {
        throw new Error(error);        
    }
})

export default routerDriver