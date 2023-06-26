const express=require("express")
const routers= express.Router();

const {getTestimonial, postTestimonial} = require("../controllers/testimonial")

routers.route("/").get(getTestimonial).post(postTestimonial)

module.exports=routers