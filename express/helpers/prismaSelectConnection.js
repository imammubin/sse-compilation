const {PrismaClient} = require('@prisma/client')
const dotenv=require("dotenv").config()

const select=(koneksi)=>{
    let prisma=new PrismaClient({
        datasources:{
            db:{
                url:koneksi
            }
        }
    })
    return prisma
}

module.exports=select