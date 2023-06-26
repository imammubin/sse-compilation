var express = require("express")
var app=express()
const bodyParser=require('body-parser')
var serveStatic=require('serve-static')
var mongoSanitize = require('express-mongo-sanitize');
var cookieParser = require('cookie-parser')
var path=require('path')

var {errorHandler} = require('./middleware/errorHandler')

const dotenv=require("dotenv")
dotenv.config()
const PORT=process.env.PORT  

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(mongoSanitize());
app.use(cookieParser(process.env.CookieSecret))

app.use("/pmbtoys",require('./MyModules/pmbtoys'))
app.use("/users",require('./MyModules/users'))

app.use("*",(req,res)=>{
    res.status(404)
    res.json({
        result:"Neangan Naon Sia ?!"
    })
    res.end()
})
app.use(errorHandler)
app.listen(`${PORT}`,()=>{
    console.log(`i'm listening on Port http://localhost:${PORT}`)
})

