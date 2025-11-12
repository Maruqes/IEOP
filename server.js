const express = require('express')
const exampleController = require("./controllers/example");

const app = express()
app.use(express.json());
const port = 8080

app.get('/', exampleController)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
