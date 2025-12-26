import express from 'express';
import productController from './controllers/products.js';
import clientController from './controllers/clients.js';
import docsController from './controllers/document.js';
import * as httpHelper from './services/http.js';
import * as mongoDb from './services/mongo.js';

const app = express();
app.use(express.json());
const port = 8080;

// mount the products/router at the root
app.use('/documents', docsController);
app.use('/products', productController);
app.use('/clients', clientController);
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
