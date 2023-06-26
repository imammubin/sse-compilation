require("dotenv").config()
const jwt = require('jsonwebtoken')

const encryptDecrypt=(token)=>{

    let array=token.split('.')
    let countText=token.split('.')[1].length *1
    let text=''
    let textCombine=""
    let newToken=""

    for(var i=0; i<countText; i++){
        text=array[1].substring(i,i+1).toString()
        if(i>3 &&  i<(countText-3)){
            if(text===text.toLowerCase())text=text.toUpperCase()
            else text=text.toLowerCase()    
        }
        textCombine+=text
    }        
    newToken=token.split('.')[0]+"."+textCombine+"."+token.split('.')[2]
 


    return newToken
}

const currentTime=()=>Math.round(new Date().getTime() / 1000)
const convertDateTime=(time)=>new Date(time * 1000)
const verifiyToken=(token)=>{
    
    let verifiedToken
    verifiedToken=jwt.verify(token, process.env.TOKEN_SECRET, (err,payload)=>{
        if(err) return 'error'
        expireTime=payload.ext
        if(currentTime>expireTime) return 'expire'
        iatDate=convertDateTime(payload.iat)
        // return {payload:payload, tokenEncrypt:tokenEncrypt, currentTime:currentTime,currentDateTime:currentDateTime,iat:payload.iat,iatDate:iatDate}
    })
    return token
    
}

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const strenghPassword=(str)=>{
    if (str.length < 6) {
        return false;
    } else if (str.length > 50) {
        return false;
    } else if (str.search(/\d/) == -1) {
        return false;
    } else if (str.search(/[a-zA-Z]/) == -1) {
        return false;
    } else if (str.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        return false;
    }
    return true;
}

module.exports={encryptDecrypt,currentTime,convertDateTime,verifiyToken,validateEmail,strenghPassword}