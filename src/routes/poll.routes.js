import { Router } from "express";
import { createPoll, getPoll } from "../controllers/poll.Controller.js";
import { getPollChoices } from "../controllers/choice.Controller.js";



const pollRouter = Router()


pollRouter.post("/poll", createPoll)
pollRouter.get("/poll", getPoll)
pollRouter.get("/poll/:id/choice", getPollChoices)


export default pollRouter