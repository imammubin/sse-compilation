const express=require("express")
const jwt = require('jsonwebtoken')
const asyncHandler=require("express-async-handler")
const bcrypt = require("bcrypt")
const routers=express.Router()
const gocekToken=require("../../../helpers/gocekToken")
const dotenv=require("dotenv").config()
const prismaSelectConnection=require('../../../helpers/prismaSelectConnection')

const index=asyncHandler(async(req,res,next)=>{
    let data=null
    let result="ok"
    if(req.tokenProvide){
        data={}
        data.user_id=req.user_id
        data.email=req.email
        res.status(200)     
    }    
    res.json({result:result, data:data, token:req.tokenProvide}) 
    res.end()

})

const refreshToken=asyncHandler(async(req,res,next)=>{
    let data=null
    let result="fail"
    if(req.tokenProvide){
        data={}
        data.user_id=req.user_id
        data.email=req.email
        res.status(200)     
        result="ok"   
    }    
    res.json({result:result, data:data, token:req.tokenProvide}) 
    res.end()
})

const login=asyncHandler(async(req,res)=>{
    res.status(200)
    res.json({result:"ok",code:"200",page:"login User"})
    res.end()
})

const logout=asyncHandler(async(req,res)=>{
    res.status(200)
    res.json({result:"ok",code:"200",page:" User OUT"})
    res.end()
})

const register=asyncHandler(async(req,res,next)=>{

    let token,verifiedToken
    const{fullname,email,password,}=req.body

    const salt = bcrypt.genSaltSync(10);
    const Hasspassword = bcrypt.hashSync(password,salt)
    const compareHasspassword=bcrypt.compareSync(password,Hasspassword)  


    let data={}
    let result={}
    let inTime, currentTime, currentDateTime, expireTime, expireDateTime

    data.fullname=fullname
    data.email=email
    data.isAdmin=false
    data.password=Hasspassword

    /*
        FIND USER
    */
    try{
        if(fullname===null || fullname==="") throw new Error(`fullname couldn't be empty`)
        if(fullname.length<8) throw new Error(`fullname length less than 8 character`)
        if(email===null || email==="") throw new Error(`email couldn't be empty`)
        if(!gocekToken.validateEmail(email)) throw new Error(`please completly email address`)
        
        if(password===null || password==="") throw new Error(`password empty`)
        if(password.length<6) throw new Error(`password length less than 6 character`)
        if(password.length>=32) throw new Error(`password length max 32 character`)
        if(!gocekToken.strenghPassword(password)) throw new Error(`password must containt alpha numeric and symbolic`)
                
        let prismaSelect=prismaSelectConnection(process.env.NODE_ENV==='development'?process.env.MONGODB_LOCAL:process.env.MONGODB_IMAMMUBIN_UP_READER);
        let cari= await prismaSelect.Users.findUnique({
            where:{
                email:email
            }
        })
        if(cari!=null && cari.email===email){
            throw new Error(`${email} already registered`)
        }
    }catch(error){
        next(error)
    }

    try{
        let datasourcesDB=process.env.NODE_ENV==='development'?process.env.MONGODB_LOCAL:process.env.MONGODB_IMAMMUBIN_UP_ADMIN

        let prismaSelect=prismaSelectConnection(datasourcesDB);
        let users = await prismaSelect.Users.create({
            data:{
                fullname:fullname,
                email:email,
                password:password,
                username:fullname.split(" ").join("")+"."+email.toString()
            }
        })

        let data={}
        data.fullname=fullname
        data.id=users.id
        data.email=email
        data.isAdmin=false
    
        currentTime=gocekToken.currentTime()
        currentDateTime=gocekToken.convertDateTime(currentTime)
        expireTime=parseInt(currentTime+(60*60))
        expireDateTime=gocekToken.convertDateTime(expireTime)

        token =jwt.sign({data}, process.env.TOKEN_SECRET.toString(), {expiresIn:60*60})
        tokenEncrypt=gocekToken.encryptDecrypt(token)    

        let dataCallback={}
        dataCallback.user_id=users.id
        dataCallback.isAdmin=false
        dataCallback.token=tokenEncrypt
        // dataCallback.tokenEncrypt=tokenEncrypt
        dataCallback.created=currentTime
        dataCallback.expired=expireTime

        let tokenizer=await prismaSelect.Token.create({
            data:{
                user_id:users.id,
                string: token
            }
        })
        dataCallback.token_id=tokenizer.id
        
        res.status(200)
        res.json({result:"ok",code:"200",data:dataCallback,page:" User register"})
        res.end()
    }catch(e){
        next(e)
    }

})

const patkosongempat=asyncHandler(async(req,res)=>{
    res.status(405)
    res.json({
        result:"fail",
        code:"405",
        message:"Method Not Allowed"
    })
    res.end()
})

module.exports={index, register, login, logout, refreshToken, patkosongempat}