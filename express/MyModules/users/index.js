const express=require("express")
require("dotenv").config()
const router=express.Router({mergeParams:true})

const {index, login, register, logout, patkosongempat,refreshToken} = require("./controllers")
const {cekJWT} = require("../../middleware/JWTandROLE")

router.route("/login").post(login).get(patkosongempat)
router.route("/register").post(register).get(patkosongempat)
router.use("/logut",logout)
router.use("/update",logout)
router.use("/refreshtoken",cekJWT("high","role"),refreshToken)
router.use("/",cekJWT("low","role"),index)

module.exports=router