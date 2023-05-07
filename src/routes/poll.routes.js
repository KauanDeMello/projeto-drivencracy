import { Router } from "express";

const pollRouter = Router()


pollRouter.post("/polls")
pollRouter.get("/polls")
pollRouter.delete("/polls/id:")
pollRouter.put("/polls/id:")
pollRouter.patch("/polls/id:")

export default pollRouter