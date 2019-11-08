require("dotenv").config();
const commad = require("./command");
const modality = require(`./${process.env.MODALITY}`);