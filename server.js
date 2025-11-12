import express from 'express';
import productController from './controllers/products.js';
import * as httpHelper from './services/http.js';

const app = express();
app.use(express.json());
const port = 8080;

// mount the products/router at the root
app.use('/products', productController);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
