const express = require("express");
const exampleService = require("../services/example");

const router = express.Router();

function test(req, res) {
	res.send(exampleService.test())
}

router.get("/", test);

module.exports = router;
