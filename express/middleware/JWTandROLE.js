const jwt=require("jsonwebtoken")
const dotenv=require("dotenv").config()
const gocekToken = require('../helpers/gocekToken')
const asyncHandler=require('express-async-handler')
const prismaSelectConnection=require('../helpers/prismaSelectConnection')
var Promise = require('promise');

const verifyToken=async(jwt,token,key)=>{
    if(!token) return {};
    return new Promise((resolve,reject) =>
       jwt.verify(token,key,(err,decoded) => err ? reject({code:403,message:'token invalid'}) : resolve(decoded))
    );
 }


 const getUsersByEmail= async(email)=>{
    if(!email) return 'noemail'
    let datasourcesDB=process.env.NODE_ENV==='development'?process.env.MONGODB_LOCAL:process.env.MONGODB_IMAMMUBIN_UP_READER
    let prismaSelect=  prismaSelectConnection(datasourcesDB);

    return new Promise((resolve,reject)=>{
        let users= prismaSelect.Users.findUnique({
            where:{
                email:email
            }
        })
        resolve(users)
        
    })
}

const cekJWT=(priority,role)=>asyncHandler(async(req,res,next)=>{

    let prioritas=priority.toString()

    if(priority)
    {

        /** GET BEARER & SECRET KEY JWT TOKEN */
        let authHeader = req.get('authorization')
        req.tokenProvide=false

        if(priority==="high" && (!authHeader || authHeader==='undefined')){
            const error = new Error("authHeader with no bearer tokens priority:"+priority)
            error.code = "403"
            throw error;            
        }
        if(priority==="low" && (!authHeader || authHeader==='undefined') ){
            next()
        }

        let token=authHeader?.split(" ")[1]
        let secretKey=process.env.TOKEN_SECRET
    
        /** ENCRYPT TOKEN  */
        tokenEncrypt=gocekToken.encryptDecrypt(token)
        let v= await verifyToken(jwt,tokenEncrypt,secretKey)
        let user_id=v.data.id
        let email=v.data.email
        let isAdmin=v.data.isAdmin
        let users= await getUsersByEmail(email)

        

        if(priority==="high" && (!authHeader || authHeader==='undefined')){
            const error = new Error("No Token Provide")
            error.code = "403"
            throw error;            
        }

        if(priority==="high" && (!user_id || !email || !users)){
            const error = new Error("No Token Provide")
            error.code = "403"
            throw error;            
        }
    
        if((priority==="high" && (!user_id || !email || !users)) && (users.id!=user_id || users.email!=email)){
            const error = new Error("Invalid Token, User Account not match")
            error.code = "403"
            throw error;
        }
    
        /** kirimkan id user ke request */
        req.user_id=user_id
        req.email=email
        req.users=users
        req.isAdmin=isAdmin        
        req.bearer=tokenEncrypt
        req.tokenProvide=true

    }

    next()
})



module.exports={cekJWT}