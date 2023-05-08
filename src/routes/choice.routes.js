import { Router } from "express";
import { createChoice } from "../controllers/choice.Controller.js";




const choiceRouter = Router()


choiceRouter.post("/choice", createChoice)


export default choiceRouter