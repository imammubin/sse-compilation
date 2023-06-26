const express=require("express")
const routers= express.Router();

const {runSeeder} = require("../controllers/seed")
routers.route("/").get(runSeeder)

module.exports=routers