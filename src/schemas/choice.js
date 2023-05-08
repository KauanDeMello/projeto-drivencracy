import joi from "joi";

export const choiceSchema = joi.object({
  id: joi.string().required(),
  title: joi.string().required(),
  votes: joi.number().integer().min(0).default(0),
});