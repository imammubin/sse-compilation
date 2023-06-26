
require('dotenv').config()
const empatkosongempat=(err,req,res,next)=>{
    res.status(404)
    res.result({
        result:"404"
    })
}

const errorHandler=(err,req,res,next)=>{
    const statusCode=err.code?err.code:res.statusCode?res.statusCode:500
    res.status(statusCode).json({
        result:"fail",
        message:err.message,
        stack: process.env.NODE_ENV==='production'?null: err.stack
    })
}

module.exports={errorHandler,empatkosongempat}
