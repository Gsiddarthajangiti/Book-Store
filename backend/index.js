import cors from 'cors'
import express from "express"
import mongoose from "mongoose"
import { mongoDBURL, PORT } from './config.js'
import { Book } from './models/bookModel.js'
import booksRoute from './routes/booksRoute.js'
const app = express()
app.use(express.json())
app.use(cors());
//app.use(cors({
//origin:'*',
//methods:['GET','POST','PUT','DELETE'],
 //allowedHeaders: ['Content-Type'],
//}

//))
app.get('/',(req,res)=>{
    return res.status(234).send("welcome  ")

})
app.use('/books',booksRoute)
app.post('/books',async (req,res)=>{
    try{
       if( !req.body.title||
        !req.body.author||
        !req.body.publishYear){
            return res.status(400).send({
                message:'Send all required fields: title, author, publishYear',
            })
        }
        const newBook={
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        }
        const book = await Book.create(newBook)
        return res.status(201).send(book)


    }
    catch(error){
        console.log(error.message)
        res.status(500).send({message:error.message})
    }

})
app.get('/books',async (req,res)=>{
    try{
        const books=await Book.find({})
        return res.status(200).json({
            count:books.length,
            data:books
        })
    }
    catch(error){
        console.log(error.message)
        res.status(500).send({message:error.message})
    }
})
app.get('/books/:id',async (req,res)=>{
    try{
        const {id}=req.params
        const books=await Book.findById(id)
        return res.status(200).json(books)
    }
    catch(error){
        console.log(error.message)
        res.status(500).send({message:error.message})
    }
})

app.put('/books/:id',async (req,res)=>{
    try{
        if( !req.body.title||
            !req.body.author||
            !req.body.publishYear
        ){
                return res.status(400).send({
                    message:'Send all required fields: title, author, publishYear',
                })
            }
        const {id}=req.params
        
        const result= await Book.findByIdAndUpdate(id,req.body)
        if(!result){
            return res.status(404).json({message: 'Book not found'})
        }
        return res.status(404).send({message: 'Book updated successfully'})

    }
    catch(error){
        console.log(error.message)
        res.status(500).send({message:error.message})
    }
})

app.delete('/books/:id',async (req,res)=>{
    try{
        const {id}=req.params
        
        const result= await Book.findByIdAndDelete(id,req.body)
        if(!result){
            return res.status(400).json({message: 'Book not found'})
        }
        return res.status(200).send({message: 'Book Deleted successfully'})

        
    }
    catch(error){
        console.log(error.message)
        res.status(500).send({message:error.message})
    }
})





mongoose.connect(mongoDBURL).then(
    ()=>{
        console.log('app connected to database')
    }
).catch((err)=>{
    console.log(err)
})


app.listen(PORT,()=>{
    console.log(`App is listening to port: ${PORT}`)
})