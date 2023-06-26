const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({origin:"*"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => {

  response.json({clients: clients.length})
  clients.forEach( client=>{
    client.res.write(`id: ${client.id} \n`)
    client.res.write("event: pesan\n")
    client.res.write(`data: 123 \n\n `)
    console.log(`${client.id} send ${newFact}`)
  })

}

);
app.get('/stream',(req,res)=>{
    const clientId = Date.now();     
    const newClient = {id:clientId, res};  
    clients.push(newClient);
    let headers={
        'content-type':'text/event-stream',
        'Cache-Control': 'no-cache',
        'connection':'keep-alive',
        'origin':"*"
    }
    res.writeHead(200,headers)
    const datanya={mykey: 'myvalue', eventName: 'newlogin'}
    clients.forEach( client=>{
        client.res.write(`id: ${client.id} \n\n`)
        client.res.write(`data: ${datanya} \n\n `)
        client.res.write(`event: pesan \n\n `)
        console.log(`${client.id} send ${newFact}`)
    })
    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

app.get('/post',(req,res,next)=>{
    const newFact='req.body'
    facts.push(newFact)
    res.json({result:`${newFact}`})
    return clients.forEach( client=>{
        client.res.write(`id: ${client.id} \n\n data: ${newFact} \n\n event: new_message`)
        console.log(`${client.id} send ${newFact}`)
    })    
})
const PORT = 3030;
let clients = [];
let facts = [];
let newFact=''

app.get('/',(req,res)=>{
  res.json({result:"OK"})
})

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})