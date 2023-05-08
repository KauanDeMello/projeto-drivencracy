import { Router } from "express";
import { createChoice, getPollChoices } from "../controllers/choice.Controller.js";




const choiceRouter = Router()


choiceRouter.post("/choice", createChoice)
choiceRouter.post("/choice", createChoice)




export default choiceRouter