//creating an api
// import
import express from 'express';
import mongoose from 'mongoose'
import Messages from './dbMessages.js';
import Pusher from 'pusher'
import cors from 'cors';
// app config
const app = express() //creates application and will allow us to write api routes.
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: "1177935",
    key: "c21624dc31efdb828d12",
    secret: "efba0736e53ba1d8a706",
    cluster: "eu",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(cors());

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next()
// })

//DB config
const connection_url = "mongodb+srv://admin:70tDBuvZtOaRNrnA@cluster0.vza9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


mongoose.connect(connection_url, {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
//????
const db = mongoose.connection;
db.once('open',()=>{
    console.log('db connected');
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    
    changeStream.on('change', change => {
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name:messageDetails.name,
                message: messageDetails.message,
                timestamp:messageDetails.timestamp,
                received:messageDetails.received
              });
        }else{
            console.log("Error triggering pusher")
        }
    });
})

//api route

app.get('/',(req,res)=> res.status(200).send('hello world')) //send get request to app at the root url and it will return hello world if the status of the response is ok (200).
app.get('/messages/sync', (req,res)=>{

    Messages.find((err,data) =>{
        if(err) {
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})
app.post('/messages/new', (req,res)=>{
    const dbMessage = req.body

    Messages.create(dbMessage, (err,data) =>{
        if(err) {
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})


//listener

app.listen(port, ()=> console.log(`Listen on localhost:${port}`))