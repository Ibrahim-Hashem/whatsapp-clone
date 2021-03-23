//creating an api


// import
import express from 'express';
import mongoose from 'mongoose'

// app config
const app = express() //creates application and will allow us to write api routes.
const port = process.env.PORT || 9000

//middleware

//DB config
const connection_url = "mongodb+srv://admin:70tDBuvZtOaRNrnA@cluster0.vza9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(connection_url, {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
//????

//api route

app.get('/',(req,res)=> res.status(200).send('hello world')) //send get request to app at the root url and it will return hello world if the status of the response is ok (200).

//listener

app.listen(port, ()=> console.log(`Listen on localhost:${port}`))