const express = require("express")
var app=express.Router({mergeParams:true})

const {Prisma, PrismaClient}=require('@prisma/client')
const e = require('express')
const urlDB=process.env.NODE_ENV==='development'?process.env.MONGODB_PMBTOYS_LOCAL:MONGODB_PMBTOYS_ADMIN
let prisma=new PrismaClient({
    datasources:{
        db:{
            url: urlDB
        }
    }
})


app.use("/seed",require("./routers/seed"))
app.use("/testimonial",require("./routers/testimonial"))
app.use("/",async(req,res)=>{
    let currentTime=Math.round(new Date().getTime() / 1000)
    let expireDate=new Date(currentTime +(60*60) *1000)
    
    console.log('Cookies: ', req.signedCookies['cookieName'])

    let user=await prisma.users.findMany({
        select:{
            token:true,
            email:true

        }
    })

    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    res.cookie('cookieName', 'cookieValue', {maxAge: 3600*1000, domain:"localhost", httpOnly:true, signed:true, secure:true})
    res.cookie ('token', 'abcdef12345', {maxAge: 3600*1000, domain:"localhost", sameSite:'strict', httpOnly:true, signed:true, secure:true})
    res.header("Access-Control-Allow-Origin", '*');

    // res.send(req.signedCookies.cookie)
    res.json({ result: user})
    res.end()

})

module.exports=app