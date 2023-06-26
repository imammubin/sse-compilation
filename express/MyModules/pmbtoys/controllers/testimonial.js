const asyncHandler= require('express-async-handler')
require("dotenv").config()
const {PrismaClient}=require('@prisma/client')
let prisma=new PrismaClient({
    datasources:{
        db:{
            url:'mongodb://localhost:27090/master?directConnection=true'
        }
    }
})

const getTestimonial=asyncHandler(async(req,res)=>{
    const url=req.url
    let data=await prisma.testimonial.findMany()
    res.status(200)
    res.json({
        result:"Index Testimonial - Controllers",
        data:data
    })
    res.end()
})

const postTestimonial=asyncHandler(async(req,res)=>{
    try{
        let result= await prisma.testimonial.create({
            data:{
                title:"ini title baru",
                content:"ini content",
                url:"www.awewe.com",
                nama:"perusahaan",
                nama_perusahaan:"nama perusahaannya"
            }
        })
        return res.status(200) .json({
            result:"ok",
            hasil:result,
            page:"Post Testimonial"
        })
    
    }catch(e){
        res.status(503) .json({
            result:"fail",
            data:e
        })
    }
})

module.exports={getTestimonial, postTestimonial} 