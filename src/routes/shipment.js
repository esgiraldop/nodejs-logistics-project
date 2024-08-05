import { Router } from "express";
import {fileURLToPath} from "url";
import {promises as fs} from "fs";
import path from "path";

const routerShipment = Router();

const _fileName = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_fileName);

const route = path.join(_dirName, "../../data/shipments.json");

const readFile = async () => {
    try {
        const data = await fs.readFile(route, "utf8");
        return JSON.parse(data);  
    } catch (error) {
        throw new Error(error.message)
    }
};

const writeFile = async (newData) => {
    try {
        const data = await fs.writeFile(route, JSON.stringify(newData, null, 2), "utf8");
        return JSON.stringify(newData);
    } catch (error) {
        throw new Error(error.message)
    }
};

routerShipment.get('/', async (req, res) => {
    try {
        const data = await readFile();
        const response = {
            shipments: data
        };
        res.json(response);
    } catch (error) {
        res.status(500).sendStatus(error.message);
    }
});

routerShipment.get('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const shipmentIndex = data.findIndex(shipmen => shipmen.id === parseInt(req.params.id));
        console.log(shipmentIndex);
        if (shipmentIndex === -1) return console.log('Shipment not found');
        res.json(data[shipmentIndex]);
    } catch (error) {
        throw new Error(`Error in get for id ${error}`)
    }
});

routerShipment.post('/', async (req, res) => {
    try {
        const data = await readFile();
        const newData = {
            id: data.length + 1,
            items: req.body.item,
            quantity: req.body.quantity,
            warehouseId: req.body.warehouseId
        };
        data.push(newData);
        const response = {
            message: "Shipment created successfully",
            shipment: newData
        };
        await writeFile(data);

        res.json(response);
    } catch (error) {
        res.status(500).sendStatus(error.message);
    }
});

routerShipment.put('/:id', async (req, res) => {
    try {
        const data = await readFile();
        const shipment = data.findIndex(shipment => shipment.id === parseInt(req.params.id));
        if ( shipment === -1 ) return console.log('Shipment is not found');
        data[shipment] = { ...data[shipment], ...req.body };
        await writeFile(data);
        res.json(data[shipment]);  
    } catch (error) {
        throw new Error(`Error in put ${error}`)
    }
});

routerShipment.delete('/:id', async (req,res) => {
    const data = await readFile();
    const shipmentIndex = data.findIndex(shipment => shipment.id === parseInt(req.params.id));
    console.log(shipmentIndex);
    if( shipmentIndex === -1 ) return console.log('shipment is not found');
    data.splice(shipmentIndex, 1);
    await writeFile(data);
    res.json({ message: 'Shipment deleted successfully' });
});

export default routerShipment;

