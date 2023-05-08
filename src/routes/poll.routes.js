import { Router } from "express";
import { createPoll, getPoll, getPollResult } from "../controllers/poll.Controller.js";
import { getPollChoices, registerVote } from "../controllers/choice.Controller.js";



const pollRouter = Router()


pollRouter.post("/poll", createPoll)
pollRouter.get("/poll", getPoll)
pollRouter.get("/poll/:id/choice", getPollChoices)
pollRouter.get("/poll/:pollId/choice/:choiceId/vote", registerVote)
pollRouter.get("/poll/:id/result", getPollResult)


export default pollRouter