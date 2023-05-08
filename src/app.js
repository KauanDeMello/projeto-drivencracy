import express  from "express";
import cors from "cors"
import pollRouter from "./routes/poll.routes.js"
import choiceRouter from "./routes/choice.routes.js"


const app = express()
app.use(express.json())
app.use(cors())
app.use(pollRouter)
app.use(choiceRouter)


const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})