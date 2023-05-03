import express  from "express";
import cors from "cors"
import { MongoClient } from "mongodb";
import dotenv from "dotenv"


// server database

const app = express()

app.use(express.json())
app.use(cors())
dotenv.config()

// setup DataBase
let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

// PORT 
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))