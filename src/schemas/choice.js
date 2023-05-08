import joi from "joi";

export const choiceSchema = joi.object({
  title: joi.string().required(),
  votes: joi.number().integer().min(0).default(0),
});