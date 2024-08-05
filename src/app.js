import express from 'express';
import dotenv from "dotenv";
import errorHandler from './middlewares/errorHandler.js';
import router from './routes/warehouses.js';
import routerShipment from './routes/shipment.js';
import routerDriver from './routes/drivers.js';


const app = express();

dotenv.config();

const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use('/warehouses', router);
app.use('/shipments', routerShipment);
app.use('/drivers', routerDriver);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});