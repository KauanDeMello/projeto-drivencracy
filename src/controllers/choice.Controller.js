import { db } from "../database/database.connections.js";
import { choiceSchema } from "../schemas/choice.js";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

export async function createChoice(req, res) {
    const { title, pollId } = req.body;
  
    try {
    
      const poll = await db.collection("polls").findOne({ _id: new ObjectId(pollId)});
      if (!poll || !poll.choices) {
        return res.status(404).json({ error: "Enquete não encontrada" });
      }
  
      // Verifica se a enquete já está expirada
      const currentDate = new Date();
      const expireAt = new Date(poll.expireAt);
      if (currentDate > expireAt) {
        return res.status(403).json({ error: "Enquete expirada" });
      }
  
   
      const { error } = choiceSchema.validate({ title });
      if (error) {
        return res.status(422).json({ error: error.message });
      }
  
 
      const choiceExists = poll.choices.find(choice => choice.title === title);
      if (choiceExists) {
        return res.status(409).json({ error: "Opção de voto já existe nesta enquete" });
      }
  
      // Adiciona a opção de voto na enquete
      const choice = { id: uuidv4(), title, votes: 0 };
      const updateResult = await db.collection("polls").updateOne(
        { _id: new ObjectId(pollId) },
        { $push: { choices: choice } }
      );
  
      
      if (updateResult.modifiedCount !== 1) {
        throw new Error("Não foi possível adicionar a opção de voto");
      }
  
   
      return res.status(201).json("Sucesso");
    } catch (error) {
      
      return res.status(500).json({ error: error.message });
    }
}