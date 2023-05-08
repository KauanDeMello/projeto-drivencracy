import { Router } from "express";
import { createPoll } from "../controllers/poll.Controller.js";



const pollRouter = Router()


pollRouter.post("/polls", createPoll)


export default pollRouter