import { Router } from "express";
import { createPoll, getPolls } from "../controllers/poll.Controller.js";



const pollRouter = Router()


pollRouter.post("/polls", createPoll)
pollRouter.get("/polls", getPolls)


export default pollRouter